## main branch

- tailwindcss configured
- Algolia Docsearch configured

## tailwind-css branch

- tailwindcss configured

## Docker command

```
docker run -it --env-file=./.env -e "CONFIG=$(cat ./algolia.config.json | jq -r tostring)" algolia/docsearch-scraper
```
