import pandas as pd
import numpy as np

# df = pd.read_excel("info.xls")
df = pd.read_excel("info.xls")
xb = "自动化工程系"
bj = []
for i in range(len(df)):
    # print(len(df))

    li = list(df.ix[i][:2])
    # print(li[0])
    if li[0] == xb:
        bj.append(li[1])
print(set(bj))
# print(df['系部'])
# print(df['班级'])
# for i in df:
#     print(i[1])
#     if i[1] == xb:
#         bj.append(i['系部'])
# print(bj)
# print(df["系部"])
# li = set(df["班级"])
# # print(len(li))
# for i in li:
#     print(i)
