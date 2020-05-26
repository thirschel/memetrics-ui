# Contributing to MeMetrics UI

As a contributor, here are the guidelines we would like you to follow:

- [Coding Rules](#coding-rules)
- [Commit Message Guidelines](#commit-message-guidelines)

### Static Branches

The following are a list of branches that always exist and have special rules in regard to pushing to them:

- **staging** - Represents the current stage build and also where all code will be promoted from. This is the Default branch in the project.

  > If you are coming from GitFlow, think of this as the `Develop` branch.

- **master** - Represents what is currently on production. You should **not** need to merge into this branch directly. Only new Releases merge into this branch.

## Coding Rules

To ensure consistency throughout the source code, keep these rules in mind as you are working:

- We follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)

## Commit Message Guidelines

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**. But also,
we use the git commit messages to **generate the change log**.

### Commit Message Format

```code
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

```text
docs(changelog): update changelog to beta.5
```

```text
fix(release): need to depend on latest rxjs and zone.js

The version in our package.json gets copied to the one we publish, and users need the latest of these.
```

### Revert

If the commit reverts a previous commit, it should begin with `revert:`, followed by the header of the reverted commit. In the body it should say: `This reverts commit <hash>.`, where the hash is the SHA of the commit being reverted.

### Type

Must be one of the following:

- **build**: Changes that affect the build system or external dependencies
- **ci**: Changes to our CI configuration files and scripts
- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix
- **perf**: A code change that improves performance
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- **test**: Adding missing tests or correcting existing tests

### Scope

The scope should be the name of the area of work affected (as perceived by the person reading the changelog generated from commit messages.

There are currently a few exceptions to the "use area of work" rule:

- **changelog**: used for updating the release notes in CHANGELOG.md

- none/empty string: useful for `style`, `test` and `refactor` changes that are done across all
  packages (e.g. `style: add missing semicolons`) and for docs changes that are not related to a
  specific package (e.g. `docs: fix typo in tutorial`).

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.