# File Task runner
Simple tool to automate executing cli programs on multiple files which normally is done on single files.

It will take the command defined in your configuration, for example `cat`.
It will execute a shell command for each file the glob finds.
In a folder with 4 files, and glob `folder/*`, the following commands will be executed.  
```
cat /fullpath/file1.ext
cat /fullpath/file2.ext
cat /fullpath/file3.ext
cat /fullpath/file4.ext
```

By default the output will not be shown, so cat is not the best usage.
But if you want to make all shell scripts in some directory structure executable, the configured command could be `chmod +x`.

# Usage 
Global install  
`filetask test "./src/*.ts"`  
Local install  
`./node_modules/.bin/filetask run "./src/*.ts" true`  

By default the tool wil look for a `taskConfig.json` in the current and parent folders. Alternatively it can be passed using the -c flag.


| command | arguments       | description                                                                                                                                       |
|---------|-----------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| test    | glob            | This function will test your config, and list the commands that will be executed                                                                  |
| run     | glob [parallel] | Creates a shell command for each file found with the glob, and will execute it, can be run at the same time by passing true after the globPattern |
| help    |                 | List help                                                                                                                                         |

# Configuration
```js
{
    "command": "cat", // lefthand side of shell command that will be executed
    "taskVerbose": false, // If set to true, instead of a progress bar, the output of all commands will be executed
    "replacePattern": "/Users/exampleuser/projects/js/task-run/", // if set will try to replace this in the filepath to the replace value
    "replaceValue": ""
}
```