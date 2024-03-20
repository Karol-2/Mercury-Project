script_path=$(readlink -f "$0")
script_dir=$(dirname "$script_path")

echo "Exporting realms. Please wait a moment..."
docker compose exec keycloak sh -c "
  /opt/keycloak/bin/kc.sh export \
      --dir /opt/keycloak/data/import \
      --users same_file
"

realm_dir="$script_dir/realms"

# Remove ignored master realm files
if ls "$realm_dir" | grep -q master-realm.json; then
  rm "$realm_dir/master-realm.json"
  rm "$realm_dir/master-users-0.json"
fi
