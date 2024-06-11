# bitA-crawl

Crawl all products of https://www.lazada.vn/locklock-flagship-store/?q=All-Products&from=wangpu&langFlag=vi&pageTypeId=2 page

## Crawl script

Following steps below to run crawl script

### 1. Move to script folder

```
cd ./scripts
```

### 2. Install dependencies

```
npm i
```

### 3. Update configs (if needed) in configs.json file

Configs format like below. I divided crawl script into 2 steps:

- Crawl data -> Store as file in out folder
- Insert data -> Insert product info into database
  -> If you want to skip which step -> set it to false

```
{
  "DB_URI": "mongodb://localhost:27017/",
  "TARGET_URL": "https://www.lazada.vn/locklock-flagship-store/?q=All-Products&from=wangpu&langFlag=vi&pageTypeId=2",
  "STEPS": {
    "crawlData": true,
    "insertDB": true
  }
}
```

### 4. Run script

```
node crawlData.js
```

## Start server

Following steps below to start server

### 1. Move to server folder

```
cd ./server
```

### 2. Install dependencies

```
npm i
```

### 3. Setup .env file and update env if you want

```
cp .env.template .env
```

### 4. Start server

```
npm run start
```
