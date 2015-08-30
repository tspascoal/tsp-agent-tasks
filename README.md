# Tiago Pascoal Custom Agent Tasks

## Overview
Custom tasks that are meant to be used with Visual Studio Online and Team Foundation Server for build tasks.

All tasks should work against windows agent and [Xplat build agent](https://msdn.microsoft.com/en-us/Library/vs/alm/Build/agents/xplat) (unless stated otherwise).

All tasks are licensed under MIT's licence

## Uploading Tasks
You need to upload these tasks to your TFS / VSO server.

1. Clone the repo
2. Install [tfx-cli] (https://github.com/Microsoft/tfs-cli)
3. Run `tfx login` to login
4. Run `tfx build tasks upload <path to task folder>` to upload a task, where <path to task folder> is the path to the Task folder of the task you want to upload

The task should now be available on your TFS / VSO to be used on builds.

## Tasks
The following tasks are available:

### npm publish
This task allows you to publish npm packages to public or private package to an npm repository server. [More...](./Tasks/NpmPublish)

