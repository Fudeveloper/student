import re
import base64

# 内置的替换图片的xml字符串
pic_buildin_code = '<w:pict><w:binData w:name="wordml://signature_index.png">signature_base64</w:binData><v:shape id="_x0000_s1026" o:spt="75" alt="" type="#_x0000_t75" style="height:38.15pt;width:87pt;" filled="f" o:preferrelative="t" stroked="f" coordsize="21600,21600"><v:path/><v:fill on="f" focussize="0,0"/><v:stroke on="f"/><v:imagedata src="wordml://signature_index.png" o:title="1"/><o:lock v:ext="edit" aspectratio="t"/><w10:wrap type="none"/><w10:anchorlock/></v:shape></w:pict>'


# 返回置入的图片代码
def gener_pic_replace_code(img_base64_data, signature_index):
    pic_code = re.sub("signature_base64", img_base64_data, pic_buildin_code)
    pic_code = re.sub("signature_index", signature_index, pic_code)
    return pic_code


# 将图片转为base64编码
def img_to_base64(img_path):
    with open(img_path, 'rb') as img:  # 二进制方式打开图文件
        img_base64 = str(base64.b64encode(img.read()))
        img_base64 = img_base64.replace("b'", "")[:-1]
        # img_base64
    return img_base64


# 通过签名图片的索引，找到模板内置的需替换字符串
def gener_signature_buildin_text(signature_index):
    return "<w:t>signature_{}</w:t>".format(signature_index)


def gener_replaced_file_str(file_str, img_path, will_replace,img_index):
    print(will_replace)
    will_build = gener_pic_replace_code(img_to_base64(img_path), str(img_index))
    # print(will_build)
    # print(will_replace)
    return re.sub(will_replace, will_build, file_str)


def write_ave(file_str, ave):
    return re.sub("score_ave", str(ave), file_str)


def fill_up(queryset, file_str):
    # 填写上半部分表格
    dem_up_value_replace = ["value_name", "value_sfz", "value_gender", "value_nation", "value_department",
                            "value_major", "value_clazz", "value_studetId"]
    student = queryset[0]
    value_name = student.name
    value_sfz = student.sfz
    value_gender = student.gender
    value_nation = student.nation
    value_department = student.department
    value_major = student.major
    value_clazz = student.clazz
    value_studetId = student.studentId
    dem_up_value = [value_name, value_sfz, value_gender, value_nation, value_department, value_major, value_clazz,
                    value_studetId]
    for i in range(len(dem_up_value)):
        value_str = dem_up_value[i]
        pre_replace_str = dem_up_value_replace[i]
        file_str = re.sub(pre_replace_str, value_str, file_str)
    return value_studetId, file_str


def gener_xml_buildin_text(buildin_text):
    return "<w:t>{}</w:t>".format(buildin_text)
