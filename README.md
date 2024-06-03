# Lovely Stay CLI Backend Test

LovelyStay CLI for Github - Backend Test

## Roadmap

- Run SonarQube

## Installation

Install with npm

```bash
  npm install
```

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_PROVIDER`

`DATABASE_HOST`

`DATABASE_PORT`

`DATABASE_USER`

`DATABASE_PASSWORD`

`DATABASE`

`BASE_API_URL`

Run the migrations

```bash
  npm run migrate
```

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Build project

```bash
  npm run build
```

## Usage/Examples

1. Get Github profile and Save it

   ```javascript
   ts-node src/main.ts -g <ProfileName>
   ```

2. Get All user on database

```javascript
ts-node src/main.ts -l
```

3. Get user by location

   ```javascript
   ts-node src/main.ts -loc <LocationName>
   ```

4. Get user by language name

   ```javascript
   ts-node src/main.ts -lang <LanguageName>
   ```

5. Help
   ```javascript
   ts-node src/main.ts -h
   ```

## Running Tests

To run tests, run the following command

```bash
  npm run test
  npm run test:coverage
```

## Authors

- [@LucasSan](https://www.github.com/lucassan)
