# from django.contrib import admin
import os
import re
import xadmin as admin
import export_helper
from django.conf import settings
from xadmin import views
# Register your models here.
# from democratic.models import FillStudentInfo
from democratic.models import FillStudentInfo
from quantization.models import StudentInfo, StudentAnswer
from quantization import models
from django.utils.html import format_html

from django.http import HttpResponse
from xlwt import *


class StudentInfoAdmin(object):
    list_display = (
        'name', 'sfz', 'studentId', 'department', 'major', 'clazz', 'gender', 'nation', "get_score",
        "get_democratic_score")
    search_fields = ('name', 'sfz', 'studentId')
    list_filter = ('clazz', "major", "gender", "StudentAnswer__score")
    actions = ["save_democratic", "save_quantization"]

    def get_score(self, instance):
        exist_student = StudentAnswer.objects.filter(studentId_id=instance.studentId)
        if exist_student:
            return exist_student[0].score
        else:
            return '暂未完成测评'

    get_score.short_description = '量化测评得分'
    get_score.is_column = True
    get_score.allow_tags = True
    # get_score.allow_sort = True
    get_score.admin_order_field = 'StudentAnswer__score'

    def save_democratic(self, request, queryset):
        try:
            sum = 0
            # 读取模板
            try:
                with open("static/doc/democratic.xml") as f:
                    global file_str
                    file_str = f.read()
            except FileNotFoundError:
                return HttpResponse("democratic.xml模板文件丢失")

            value_studetId, file_str = export_helper.fill_up(queryset, file_str)
            # 填写下半部分表格
            s = StudentInfo.objects.filter(pk=value_studetId)[0]
            # 查询有多少人评过分
            students = s.fillstudentinfo_set.all()
            if len(students) <= 5:
                people_num = len(students)
                missing_people_num = 5 - people_num
            else:
                people_num = 5
                missing_people_num = 0
            # 填写有数据的
            for i in range(people_num):
                index = 1 + i
                sf = students[i]
                people_value_str_array = ["name_{}".format(index), "job_{}".format(index), "score_{}".format(index)]
                people_value_array = [sf.name, sf.job, sf.score]
                sum += float(sf.score)
                for j in range(len(people_value_str_array)):
                    pre_replace_str = people_value_str_array[j]
                    value_str = people_value_array[j]
                    file_str = re.sub(pre_replace_str, value_str, file_str)
                img_path = os.path.join(settings.MEDIA_ROOT, str(sf.signature))
                print(img_path)
                will_replace = export_helper.gener_signature_buildin_text(str(index))
                file_str = export_helper.gener_replaced_file_str(file_str, img_path, will_replace, index)
            print("---------")
            # 写入平均得分
            if people_num == 0:
                ave = 0
                return HttpResponse("暂未有人评价此学生")
            else:
                ave = sum / people_num
            file_str = export_helper.write_ave(file_str, ave)
            # 清空无人填写的word行
            for i in range(missing_people_num):
                index = people_num + i + 1
                people_value_str_array = ["name_{}".format(index), "job_{}".format(index), "score_{}".format(index),
                                          "signature_{}".format(index)]
                for j in range(len(people_value_str_array)):
                    pre_replace_str = people_value_str_array[j]
                    file_str = re.sub(pre_replace_str, "", file_str)

            dem_down_value = []
            # dem_down_value_replace = []
            # for i in range(1, 5):
            #     dem_down_value_replace.append(["name_{}".format(str(i)), "job_{}".format(str(i)), "score_{}".format(str(i)),
            #                                    "signature_{}".format(str(i))])

            # vnd.ms-word默认以word方式打开，octet - stream默认为下载

            response = HttpResponse(content_type='application/vnd.ms-word')
            response['Content-Disposition'] = 'attachment; filename=test.doc'
            # ws.save(response)
            response.write(file_str)
            return response
        except FileNotFoundError as e:
            return HttpResponse("未找到图片")

    save_democratic.short_description = "填表_民主评议"

    def save_quantization(self, request, queryset):
        try:
            # 读取模板
            try:
                with open("static/doc/quantization.xml") as f:
                    global file_str
                    file_str = f.read()
            except FileNotFoundError:
                return HttpResponse("quantization.xml模板文件丢失")
            # 填写上半部分表格
            value_studetId, file_str = export_helper.fill_up(queryset, file_str)
            # 填写下半部分表格
            student_answer = StudentAnswer.objects.filter(pk=value_studetId)[0]
            if not student_answer:
                print("---not student answer---")
                return HttpResponse("暂无资料")
            # 填写数据部分
            people_value_str_array = ["value_zcdd", "value_hjsz", "value_jtzd", "value_mnxf", "value_fqzy", "value_mqzy",
                                      "value_fqld", "value_mqld", "value_cfmq", "value_fwqk", "value_jxrk", "value_syrk",
                                      "value_ylzc", "value_jtsz", "value_jtbg", "value_zxqj", "value_score"]
            people_value_array = [student_answer.zcdd, student_answer.hjsz, student_answer.jtzd, student_answer.mnxf,
                                  student_answer.fqzy, student_answer.mqzy, student_answer.fqld, student_answer.mqld,
                                  student_answer.cfmq, student_answer.fwqk, student_answer.jxrk, student_answer.syrk,
                                  student_answer.ylzc, student_answer.jtsz, student_answer.jtbg, student_answer.zxqj,
                                  student_answer.score]

            for j in range(len(people_value_str_array)):
                pre_replace_str = people_value_str_array[j]
                value_str = people_value_array[j]
                if not value_str:
                    value_str = ""
                file_str = re.sub(pre_replace_str, value_str, file_str)

            # 填图部分
            people_img_str_array = ["img_zcdd", "img_fqld", "img_mqld", "img_ylzc", "img_jtsz", "img_jtbg"]
            people_img_database = [student_answer.baseDatum, student_answer.fatherDatum, student_answer.motherDatum,
                                   student_answer.medicalDatum, student_answer.disasterDatum, student_answer.eventDatum]

            for i in range(len(people_img_str_array)):
                pre_replace_str = people_img_str_array[i]
                img_field = people_img_database[i]
                if not img_field:
                    file_str = re.sub(pre_replace_str, "", file_str)
                else:
                    img_path = os.path.join(settings.MEDIA_ROOT, str(img_field))
                    will_replace = export_helper.gener_xml_buildin_text(pre_replace_str)
                    file_str = export_helper.gener_replaced_file_str(file_str, str(img_path), will_replace, i)
            # file_str = export_helper.gener_replaced_file_str(file_str, img_path, index)
            # vnd.ms-word默认以word方式打开，octet - stream默认为下载
            response = HttpResponse(content_type='application/vnd.ms-word')
            response['Content-Disposition'] = 'attachment; filename=test.doc'
            # ws.save(response)
            response.write(file_str)
            return response
        except FileNotFoundError as e:
            return HttpResponse("未找到图片")
        except Exception as e:
            return HttpResponse("发生错误，{e}".format(e))
    save_quantization.short_description = "填表_量化测评"

    def get_democratic_score(self, instance):
        print("+++++++")
        infos = instance.fillstudentinfo_set.all()

        if len(infos) <= 5:
            people_num = len(infos)
        else:
            people_num = 5
        # exist_student = FillStudentInfo.objects.filter(filledStudentId_id=instance.studentId)
        if infos:
            ave = 0
            for i in range(people_num):
                ave += round(int(infos[i].score) / people_num, 1)
            if people_num == 5:
                return "已完成评测，平均分：{}分".format(ave)
            return "已有{}人评测，平均分：{}分".format(people_num, ave)
            # return exist_student[0].score
        else:
            return '暂未完成测评'

    get_democratic_score.short_description = '民主评议得分'
    get_democratic_score.is_column = True
    get_democratic_score.allow_tags = True


# get_democratic_score.admin_order_field = 'get_democratic_score'


admin.site.register(models.StudentInfo, StudentInfoAdmin)


class StudentAnswerAdmin(object):
    # fk_fields = ('pk',)
    list_display = ("studentId", "get_studentinfo_name", "score",)
    search_fields = ("studentId",)
    list_filter = (
        'zcdd', "jtzd", "mnxf", "fqzy", "mqzy", "fqld", "mqld", "cfmq", "fwqk", "jxrk", "syrk", "ylzc", "jtsz", "jtbg",
        "zxqj")
    ordering = ("-score",)

    # data_charts = {
    #     "user_count": {'title': u"User Register Raise", "x-field": "", "y-field": ("score",),
    #                    },
    # }
    def get_studentinfo_name(self, instance):
        exist_student = StudentInfo.objects.filter(pk=instance.studentId)
        if exist_student:
            return exist_student[0].name
        else:
            return '未找到学生姓名'

    get_studentinfo_name.short_description = '姓名'
    get_studentinfo_name.is_column = True
    get_studentinfo_name.allow_tags = True


admin.site.register(models.StudentAnswer, StudentAnswerAdmin)


class GlobalSetting(object):
    # 设置base_site.html的Title
    site_title = '管理系统'
    # 设置base_site.html的Footer
    site_footer = 'Powered by：福信-易班开发团队'
    menu_style = "accordion"


admin.site.register(views.CommAdminView, GlobalSetting)
