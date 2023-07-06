# GitHub Activity section adjustment script

> :wink: :sunglasses: this project is made just for fun; it can be used to convert your activity
> graph to the nice looking image :candy:
>
> :monocle_face: Do not use that to fool someone's impression about your activity

## Description

This module helps you "draw" your own activity section at Github profile.

## How it works

It generates the script that has commit messages which you can use in your repo (NOTE: it is recommended to use separate repository in Github to avoid any data loses in your existing repo(s))

## How to run

```
const githubActivity = require("./dist");

let startDate = "2022-01-09 11:15:30";
let mask = [{c:8,l:2}, {s:2}, {c:1,l:3}];

let gh = githubActivity(mask, startDate);

gh.printToFile();
```

## Requirements

At least two required parameters should be provided to generate the script:

1. Start date - the date of the first filled in activity square - e.g. `let startDate = "2022-01-09 11:15:30";`
2. The mask. Mask defines how many commits should be made for specific date or a range of dates.

## Mask example

`let mask = [{c:8,l:2}, {s:2}, {c:1,l:3}]`

Explanation: Each items of the array is specific instruction.

`{c:8,l:2}` - c is for Commit's count; l is for Length (amount of days). It means that script should prepare 8 commits for 2 subsequent days.

`{s:2}` - s is for Skip. It means that we skip 2 days (no commits)

`{c:1,l:3}` - similar to the previous commit instruction it means that we expect 1 commit for 3 subsequent days.

## Summary

If we have `let startDate = "2022-01-09 11:15:30";` and `let mask = [{c:8,l:2}, {s:2}, {c:1,l:3}]` then script will generate commits for the following days:

- `2022-01-09` - `8` commits
- `2022-01-10` - `8` commits
- `2022-01-11` - `0` commits (skip)
- `2022-01-12` - `0` commits (skip)
- `2022-01-13` - `1` commit
- `2022-01-14` - `1` commit
- `2022-01-15` - `1` commit

## Output

Once you run printToFile() method you will see the reference to the output file in the Console, e.g.:

`Output file:  /var/******/github-commits.sh`

Alternatively you may specify the desired output file location:

```
const githubActivity = require("./dist");

let startDate = "2022-01-09 11:15:30";
let mask = [{c:8,l:2}, {s:2}, {c:1,l:3}];

let gh = githubActivity(mask, startDate, '/tmp/commits.sh');

gh.printToFile();
```

## Extra settings

You may also define the list of files which can be modified and the list of commit messages you would like to use:

```

...

let gh = githubActivity(mask, startDate, '/tmp/commits.sh');

...

gh.setMessages(["MAJOR updates","MINOR update","PATCH"])
gh.setFileNames(["debug.app.log","app-web.log","notes-app.md"])

gh.printToFile();
```

## Executing Your Git File

1. Ensure you've fixed your project below by going through the below **caveats** section.
2. Then, open your CMD and type `sh <tmp/filename.sh>` i.e. `sh commits.sh`
3. Alternatively, on your entry file, add **`gh.execute()`**

## Caveats

Currently, there are a few issues with the way Node writes the file. There here is a few steps to follow to ensure your commits.sh runs. Take these steps and you'll be okay.

- Select with multi-cursor `git commit`, on windows hold _`shift + ctl + J`_
- Move cursor downward to the empty line
- Then click backspace key, such that there no space, then enter to recreate the space (this make's sure when you run the file it will not error out)
- From there, on your cmd, run _`sh <filename>.sh`_ (preferable set your entry file to be _commits.sh_)
