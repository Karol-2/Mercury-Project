request=\
"grant_type=password"\
"&client_id=mercury-testing"\
"&client_secret=5mwGU0Efyh3cT2WVX7ffA8UAWEAmrBag"\
"&username=reptilian@meta.com"\
"&password=metaverse4ever"

access_token=$(curl \
	-sS \
	-X POST \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-d "$request" \
	localhost:3000/realms/mercury/protocol/openid-connect/token \
| jq -r .access_token)

echo "Access token:"
echo "$access_token"
