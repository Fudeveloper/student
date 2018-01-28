import requests
import json

# app_key = "75695fe36534c768"
# app_secret = "58670b849a89c5ad6e2bc97a23690e94"
# callback_url = "http://123.207.68.28:8000/democratic/authorize/"
# state = ""
# url = "https://openapi.yiban.cn/oauth/authorize?client_id={0}&redirect_uri={1}&state={2}".format(app_key, callback_url,
#                                                                                                  "")
# print(url)
# response = requests.get(url)
#
# # print(response.history)
# # print(response.text)
jsonData = {"name": "1", "sfz": "1", "clazz": "\u8f6f\u4ef6\u6280\u672f1612", "studentId": "444",
            "nation": "\u6c49\u65cf", "major": "\u7269\u8054\u7f51", "gender": "\u5973",
            "department": "\u7535\u5b50\u7cfb"}

# text = json.loads(jsonData)
jsonData.__delattr__("name")
print(jsonData)
# print(jsonData['name'])
