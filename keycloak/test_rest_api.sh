# https://www.keycloak.org/docs-api/24.0.1/rest-api/index.html#_users
URL="localhost:3000/admin/realms/mercury"
TOKEN_URL="localhost:3000/realms/mercury/protocol/openid-connect/token"
[ ! $CLIENT_SECRET ] && echo "Client secret not set!" && exit 1

token=$(curl -s \
	-X POST \
	-d grant_type=client_credentials \
	-d client_id=mercury-backend \
	-d client_secret=$CLIENT_SECRET \
	$TOKEN_URL \
	| jq -r .access_token)

users_count=$(curl -s \
	-H "Authorization: Bearer $token" \
	$URL/users/count)

echo "Users count: $users_count"

read -r -d "" user_json <<- END
	{
		"username": "test_user",
		"enabled": true,
		"emailVerified": true,
		"firstName": "First",
		"lastName": "Last",
		"email": "flast@example.com"
	}
END

create_response=$(curl -sS \
	-D - \
	-o /dev/null \
	-H "Authorization: Bearer $token" \
	-H "Content-Type: application/json" \
	-d "$user_json" \
	$URL/users)

status=$(echo "$create_response" | grep "HTTP/1.1" | cut -d " " -f 2-)
if [ "$(echo $status | grep 201)" ]; then
	echo "Test user created"
else
	echo "Create test user error: $status"
fi

get_response=$(curl -s \
	-H "Authorization: Bearer $token" \
	$URL/users&username=test_user)

user_id=$(echo "$get_response" | jq -r .[0].id)
echo "User ID: $user_id"

while true; do
	echo -n -e "\r"
	read -p "Delete the user? [y/n]: " -n 1 delete
	if [ "$delete" = "y" ]; then
			echo
			curl -s \
				-X DELETE \
				-H "Authorization: Bearer $token" \
				$URL/users/$user_id			
			echo "Deleted"
			break
	elif [ "$delete" = "n" ]; then
			echo
			break
	fi
done
