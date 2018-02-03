import re

# file = open("static/doc/quantization.xml")
# file_str = file.read()
# # print(re.findall("Value_name",file_str))
# quan_value_replace = ["Value_name", "Value_sfz", "Value_gender", "Value_nation", "Value_department", "Value_major",
#                       "Value_clazz", "Value_studetId", "Value_zcdd", "Value_hjsz", "Value_jtzd", "Value_mnxf",
#                       "Value_fqzy",
#                       "Value_mqzy", "Value_fqld", "Value_mqld", "Value_cfmq", "Value_fwqk", "Value_jxrk", "Value_syrk",
#                       "Value_ylzc", "Value_jtsz", "Value_jtbg", "Value_zxqj", "Value_score"]
# print(re.sub("Value_name", "娃娃让哇让", file_str))
# # print(file_str)
# file.close()
with open("static/doc/democratic.xml") as f:
    global file_str
    file_str = f.read()
    # print(file_str)

dem_value_replace = ["Value_name", "Value_sfz", "Value_gender", "Value_nation", "Value_department", "Value_major",
                     "Value_clazz", "Value_studetId", "Name_1", "Job_1","Score_1", "Signature_1"]
for i in dem_value_replace:
    print(i)
    file_str = re.sub(i, "啊啊啊", file_str)

with open("static/doc/2.xml",'a+') as f:
    f.write(file_str)

print(file_str)

