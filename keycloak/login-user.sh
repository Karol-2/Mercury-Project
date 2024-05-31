request_body=\
"grant_type=password"\
"&client_id=mercury-testing"\
"&client_secret=5mwGU0Efyh3cT2WVX7ffA8UAWEAmrBag"\
"&username=reptilian@meta.com"\
"&password=metaverse4ever"

response=$(curl \
	-sS \
	-X POST \
	-H "Content-Type: application/x-www-form-urlencoded" \
	-d "$request_body" \
	localhost:3000/realms/mercury/protocol/openid-connect/token)

access_token=$(echo "$response" | jq -r .access_token)

echo "Access token:"
echo "$access_token"

if [ "$access_token" = "null" ]; then
	echo "Response:"
	echo "$response"
fi
