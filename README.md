# Puzzle fund internal dashboard

## How to start development and run tests?

1. Clone this repo.
1. Run `docker-compose build --no-cache`.
1. Run `docker-compose up -d`.
1. Run `cp .env.test .env`.
1. To install dependencies run `docker-compose exec portfolio npm i`.
1. Run tests `docker-compose exec portfolio npm test`.

## How to generate docs?

1. Install aglio `npm install -g aglio`.
1. Run `mkdir /usr/local/lib/node_modules/aglio/node_modules/aglio-theme-olio/cache`.
1. Generate `aglio --theme-variables cyborg --theme-template triple -i apiary.apib -o ./docs/index.html`.
