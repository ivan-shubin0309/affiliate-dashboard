# Connect to production DB (freevpnplanet)

## Setup local dev environment
- Need to get a file app/mulyoved.ovpn from Muly
- Download and install OpenVPN client, https://openvpn.net/client/
- Run OpenVPN client and add the above profile
- Set in ./app/.env DATABASE_URL="mysql://affiliatefreevpn_app:NCxk%268%7Dt%5B2%25f@35.204.215.28:3306/affiliatefreevpn_db"
- Can use any tool to connect to DB and review data, I use free DBeaver

![img_2.png](img_2.png)

## Connect to legacy PHP admin
- Go to https://affiliate.freevpnplanet.com/admin
- make sure has /admin in the end of url
- Login
  user: "admin2",
  password: "qwerty11",



