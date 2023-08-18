# New Developer Checklist

# Guidelines

Will share here some of my expectations and information to start with:

# Communication

Very important to have good communication and status updates, I expect at least 2 Slack messages every working day

**When starting the day**, report, what going to start working on, and what plan for the day, Are any open issues are waiting for me

**End of the day**, What was done today and what was left to do or the next task, any waiting issues or things waiting from me

At any time ask me anything to make sure you are on the right direction, no need to guess, Prefer to get questions to be sure I understand what you think and plan

When communicating prefer screenshots over long text to explain

Most of the communication will be using chat on Slack

No need to be polite or ask how I am, or send Hi to check if I am available, just ask or report what you want like we are in the middle of endless conversation, can do some polite stuff at the start or end of the week 🙂

# Code

## Prettier

We use prettier to format code, make sure to set up your IDE to reformat on save

## Yarn

we use `yarn` (not npm)

## Commit

Important to be familiar with basic Git operations,

Important that commit/PR will include only intended changes, this is why we use Prettier so we are sure the code format is consistent, so be sure to configure prettier

To Make sure there is no TypeScript, Lint, or Prettier issues running before committing changes

```bash
yarn confirm
```

when start to work on a new issue create a new branch from dev

for example

`git checkout -b fix/issue-123`
`git checkout -b feature/issue-123`

once you ready create a PR to dev branch, so I can review and merge

## Dependencies/npm

OK to add, but confirm with Muly before adding any

## Setup
- [ ] make sure you connect to Slack, share email address here in this issue to get invite
- [ ] Get GitHub access tp repo https://github.com/affiliatets-com/aff, share your GitHub username
- [ ] Get .env file and save in ./app/.env
- [ ] Start to app

```bash
yarn install
cd app
yarn dev
yar storybook
```

- [ ] Login to app and make sure it works

user: bd-500
pass: backdoor

- [ ] Check Figma for design https://www.figma.com/file/0JFoPEDsqew7pF100tiCOT/affiliate-dashboard-v2?node-id=0-1&t=X4psfEFNDJ6gqzow-0
- [ ] Get access to PHP legacy code https://github.com/affiliatets-com/FocusOption
- [ ] Connect to PHP legacy app and make sure it work

url: https://go.best-brokers-partners.com/
user: Default
pass: qQwerty11

## Development

- [ ] Make sure Prettier is working and you configure reformat on save
- [ ] make sure `yarn confirm` working and show no errors
- [ ] get 1st task


