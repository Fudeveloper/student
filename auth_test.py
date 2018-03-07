import requests
import json

YIBAN_URL = "https://openapi.yiban.cn/"

API_OAUTH_CODE = "oauth/authorize"

API_OAUTH_TOKEN = "oauth/access_token"

API_TOKEN_QUERY = "oauth/token_info"

API_TOKEN_REVOKE = "oauth/revoke_token"

app_key = "da3523218859f303"
app_secret = "f87025ae2a02f4f8f6a8f63ec06aeff2"
# 授权地址
auth_url = "http://123.207.68.28/auth/"
# 回调地址
callback_url = "http://f.yiban.cn/iapp193777"
state = "fjxx"
url = "{0}{1}?client_id={2}&redirect_uri={3}&state={4}&display=mobile".format(YIBAN_URL, API_OAUTH_CODE, app_key,
                                                                              callback_url,
                                                                              state)
print(url)
response = requests.get(url)

print(response.history)
print(response.text)



