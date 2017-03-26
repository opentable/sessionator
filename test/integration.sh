curl -s -X DELETE -H "Content-Type: application/json" "http://localhost:9001/v1/sessions/user-1337" | jq -cM "."

echo 'Get Unknown Session'

EXPECTED='{"_session":"user-1337","_namespaces":[]}'
ACTUAL=$(curl -s -X GET -H "Content-Type: application/json" "http://localhost:9001/v1/sessions/user-1337" | jq -cM ".")

if [ "$EXPECTED" != "$ACTUAL" ]
then
  echo "EXPECTED"
  echo $EXPECTED
  echo "ACTUAL"
  echo $ACTUAL
  exit 1
else
  echo "OK"
fi


echo 'Get Unknown Session Namespace'
EXPECTED='{"error":"not_found"}'
ACTUAL=$(curl -s -X GET -H "Content-Type: application/json" "http://localhost:9001/v1/sessions/user-1337/lastVisit" | jq -cM ".")

if [ "$EXPECTED" != "$ACTUAL" ]
then
  echo "EXPECTED"
  echo $EXPECTED
  echo "ACTUAL"
  echo $ACTUAL
  exit 1
else
  echo "OK"
fi

echo 'Set Session Namespace'
EXPECTED='{"when":"2017-03-26T15:25:25Z","_session":"user-1337","_namespace":"lastSeen"}'
ACTUAL=$(curl -s -X PUT -H "Content-Type: application/json" -d '{ "when": "2017-03-26T15:25:25Z" }' "http://localhost:9001/v1/sessions/user-1337/lastSeen" | jq -cM '{when, _session, _namespace}')

if [ "$EXPECTED" != "$ACTUAL" ]
then
  echo "EXPECTED"
  echo $EXPECTED
  echo "ACTUAL"
  echo $ACTUAL
  exit 1
else
  echo "OK"
fi

echo 'Get Expected Session'
EXPECTED='{"_session":"user-1337","_namespaces":["lastSeen"]}'
ACTUAL=$(curl -s -X GET -H "Content-Type: application/json" "http://localhost:9001/v1/sessions/user-1337" | jq -cM ".")

if [ "$EXPECTED" != "$ACTUAL" ]
then
  echo "EXPECTED"
  echo $EXPECTED
  echo "ACTUAL"
  echo $ACTUAL
  exit 1
else
  echo "OK"
fi

echo 'Get Expected Session Namespace'
EXPECTED='{"error":"not_found"}'
ACTUAL=$(curl -s -X GET -H "Content-Type: application/json" "http://localhost:9001/v1/sessions/user-1337/lastVisit" | jq -cM ".")

if [ "$EXPECTED" != "$ACTUAL" ]
then
  echo "EXPECTED"
  echo $EXPECTED
  echo "ACTUAL"
  echo $ACTUAL
  exit 1
else
  echo "OK"
fi

echo 'Delete Existing Session Namespace'
EXPECTED='{"success":true}'
ACTUAL=$(curl -s -X DELETE -H "Content-Type: application/json" -d '' "http://localhost:9001/v1/sessions/user-1337/lastSeen" | jq -cM ".")

if [ "$EXPECTED" != "$ACTUAL" ]
then
  echo "EXPECTED"
  echo $EXPECTED
  echo "ACTUAL"
  echo $ACTUAL
  exit 1
else
  echo "OK"
fi

echo 'Delete Non-Existing Session Namespace'
EXPECTED='{"error":"not_found"}'
ACTUAL=$(curl -s -X DELETE -H "Content-Type: application/json" -d '' "http://localhost:9001/v1/sessions/user-1337/lastSeen" | jq -cM ".")

if [ "$EXPECTED" != "$ACTUAL" ]
then
  echo "EXPECTED"
  echo $EXPECTED
  echo "ACTUAL"
  echo $ACTUAL
  exit 1
else
  echo "OK"
fi
