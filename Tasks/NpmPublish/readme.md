# Tiago Pascoal Custom Agent Tasks - npm publish

## Overview
This task publishes [npm](https://docs.npmjs.com/) package to a package repository.

This task requires npm to be installed on the agent host. (if this happens VSO/TFS will notify the agent you are trying run this task doesn't has the required capabilities).

## Settings
The task requires the following settings:

1. **(Optional) Registry**: The repository registry address. By default uses [npmjs](https://www.npmjs.com/), change this if you want to use a different repository.
2. **package.json path**: The path (on source control) for the [package.json](https://docs.npmjs.com/files/package.json) file of the package you want to publish."
3. **(Optional) Auth Token**: [How to configure authentication](#howtoconfigureauth) section. 
4. **(Optional) Tag**: register the package with the supplied tag.  
5. **(Optional) Access**: If the package should be published as a public (default) or restricted package.

You can get more specifics on the parameters on [publish package documentation](https://docs.npmjs.com/cli/publish)


## <a name="howtoconfigureauth"></a>How to configure authentication

Publishing packages requires user authentication, you have three choices
1. Configure the user on the account the agent is running with. You can do this by setting the registry and then doing an *npm adduser* command (this will save an authentication token in .npmrc file in the users root folder)
How to get the authentication token
2. save .npmrc with the user authentication token on source control (in the package parent folder)
3. Use the Auth Token parameter (see [Obtaining authentication token](#obtainingauthtoken) section)

### <a name="obtainingauthtoken"></a>Obtaining an authentication token

npm doesn't has a way to programatically set user credentials programatically, so the task has to create them on the fly on .nprmc configuration file but you must provide the authentication token. (hopefully this won't change in future versions)

In order to do use, invoke the npm adduser command (on any machine) and then open .npmrc file and extract the authentication token from yet (the file is located on ~/.npmrc on unix based agents and and %USERPROFILE%\.npmrc on windows machines).

Open .npmrc file and you should see either (may have other data)

1. _auth=**XXXXXX**
2. //192.168.90.200:4873/:_authToken=**"XXXXXXXXXXXXXXXXXXo="**

Get the auth token value (in bold) after the equal sign (if the 2) format also include the quotes).

The 2) format also has one line per registry (in this example the npm repository registry is *http://192.168.90.200:4873/*, so you should get the authentication token for the registry you are publishing too.

To make things worse npm changed the authentication token format in most recent versions, so you need to do this with a npm ersion similar to the one installed on the agent host (to make sure you get the token in the same format).

If you want to know more about the npmrc , you can read the [official docs](https://docs.npmjs.com/files/npmrc)

