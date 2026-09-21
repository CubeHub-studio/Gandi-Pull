# Gandi Pull

A Gandi IDE custom extension for pulling text file data directly from public GitHub repositories.

## Blocks

### pull [PATH] from [REPO] branch [BRANCH]

Example:
- PATH: README.md
- REPO: CubeHub-studio/Gandi-Pull
- BRANCH: main

### pull GitHub file URL [URL]

Accepts a normal GitHub file URL such as:
https://github.com/CubeHub-studio/Gandi-Pull/blob/main/README.md

### last pulled data

Returns the most recently downloaded file.

### last pull error

Returns the most recent error, or an empty string when there is no error.

### clear pulled data

Clears the stored data and error.

## Notes

This extension reads public text files through GitHub's raw-content host. It does not require a GitHub token.

Binary files should not be used as input. Large files may be limited by the browser or Gandi IDE.

## Loading in Gandi IDE

The JavaScript file can be loaded as a normal remote Gandi extension. Gandi's custom-extension documentation describes the gext URL format.
