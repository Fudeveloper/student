import requests
import json

YIBAN_URL = "https://openapi.yiban.cn/"

API_OAUTH_CODE = "oauth/authorize"

API_OAUTH_TOKEN = "oauth/access_token"

API_TOKEN_QUERY = "oauth/token_info"

API_TOKEN_REVOKE = "oauth/revoke_token"

app_key = "75695fe36534c768"
app_secret = "58670b849a89c5ad6e2bc97a23690e94"
# 授权地址
auth_url = "http://192.168.76.129:8000/quantization/auth/"
# 回调地址
callback_url = "http://192.168.76.129:8000/quantization/callback/"
state = "lalallsa"
url = "{0}{1}?client_id={2}&redirect_uri={3}&state={4}&display=mobile".format(YIBAN_URL, API_OAUTH_CODE, app_key,
                                                                              callback_url,
                                                                              state)
print(url)
response = requests.get(url)

print(response.history)
print(response.text)
