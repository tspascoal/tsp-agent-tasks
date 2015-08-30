#### Copyright 2015 Tiago Pascoal 
#### more info at https://github.com/tspascoal/tsp-agent-tasks
####
param (
    [string][Parameter(Mandatory = $true)] [ValidateNotNullOrEmpty()]$registry,
    [string][Parameter(Mandatory = $true)] [ValidateNotNullOrEmpty()]$packageJsonPath,	
    [string]$authToken,
	[string]$access,
	[string]$tag
)

Set-Variable NPMRC -option Constant -value ".npmrc"
Set-Variable BAKEXTENSION -option Constant -value ".bak"

function RestoreNpmrc($NpmrcPath)
{
	$npmrBak = GetNpmrcBakPath $NpmrcPath
	if(Test-Path $npmrBak) {
		Move-Item $npmrBak $NpmrcPath -Force
	}
}

function BackupNpmrc($NpmrcPath)
{	
	if(Test-Path $NpmrcPath) 
	{
		$npmrBak = GetNpmrcBakPath $NpmrcPath
		Copy-Item $NpmrcPath $npmrBak -Force
	}
}

function GetNpmrcPath($PackageRootPath)
{
	Join-Path $PackageRootPath $NPMRC
}

function GetNpmrcBakPath($NpmrcPath)
{
	return $NpmrcPath + $BAKEXTENSION
}

function SetNpmrcAuth ($Registry, $Token, $File)
{
	$registryUri = [System.Uri]$Registry
	Add-Content $File ("//{0}/:_authToken={1}`n" -f $registryUri.Authority, $Token ) 
}

############################################## PS Script execution starts here ##########################################

Write-Verbose 'Entering NpmPublish.ps1'

# Import the Task.Common dll that has all the cmdlets we need for Build
import-module "Microsoft.TeamFoundation.DistributedTask.Task.Common"

if((Test-Path -PathType Leaf $packageJsonPath) -eq $false)
{
    throw $packageJsonPath + " file not found."
}

$packageRootPath = Resolve-Path (Join-Path (Split-Path $packageJsonPath) "..")
$packagePublishName = Split-Path (Split-Path $packageJsonPath) -Leaf

$npm = Get-Command -Name npm -ErrorAction Ignore

if(!$npm) 
{ 
    throw "Unable to locate npm"
}

# set path so the project .npmrc file is read instead of the global one
Write-Verbose "Setting working folder to $packageRootPath"
Set-Location $packageRootPath

Write-Verbose "using registry $registry"
$env:npm_config_registry = $registry

$npmrcPath = GetNpmrcPath $packageRootPath

if($authToken) {
	Write-Verbose "Setting authentication token to file $npmrcPath"

	# cover old NPM version
	$env:_auth = $authToken

	BackupNpmrc $npmrcPath
	SetNpmrcAuth -Registry $registry -Token $authToken -File $npmrcPath
}

$npmArgs = " publish $packagePublishName"

if($tag) {
	$npmArgs = $npmArgs + " --tag $tag"
}
if($access) {
	$npmArgs = $npmArgs + " --access $access"
}

Write-Verbose "Going to publish package:  $packagePublishName"
Write-Verbose "Running npm $npm.Path" 

Try {
	Invoke-Tool -Path $npm.Path -Arguments $npmArgs -WorkingFolder $packageRootPath 
} 
Finally {
	#cleanup
	if($authToken) {
		Remove-Item $npmrcPath -Force 
		RestoreNpmrc $npmrcPath
	}
}
