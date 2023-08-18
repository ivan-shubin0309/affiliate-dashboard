
# Admin Commands

http://localhost:3001/api/trpc-playground
https://affiliate.best-brokers-partners.com/api/trpc-playground
https://best-brokers-partners.staging.affiliatets.com/api/trpc-playground
https://go.freevpnplanet.com/api/trpc-playground

![img.png](img.png)

## Execute any query on the database

```js
await trpc.misc.runAdminCommand.mutate({
  cmd: "prisma-query",
  data: "SELECT id,mail from affiliates",
  secret: "eEZJPfeWIzfXZG7Kgf11TXBOxmDyh8+r8VaPh8LTiUM="
})
```

```js
await trpc.misc.runAdminCommand.mutate({
  cmd: "prisma-query",
  data: "SELECT id from traffic WHERE views > 0 AND affiliate_id = 500 AND rdate >= '2022-10-31 22:00:00' AND rdate <= '2023-04-30 20:59:59'",
  secret: "eEZJPfeWIzfXZG7Kgf11TXBOxmDyh8+r8VaPh8LTiUM="
})
```

![img_1.png](img_1.png)
