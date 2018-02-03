# from django.contrib import admin
import os
import re
import xadmin as admin
import base64

import io
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
    actions = ["SaveExecl", ]

    def get_score(self, instance):
        exist_student = StudentAnswer.objects.filter(studentId_id=instance.studentId)
        if exist_student:
            return exist_student[0].score
        else:
            return '暂未完成测评'

    get_score.short_description = '量化测评得分'
    get_score.is_column = True
    get_score.allow_tags = True
    get_score.allow_sort = True
    get_score.admin_order_field = 'get_score'

    def SaveExecl(self, request, queryset):
        with open("static/doc/democratic.xml") as f:
            global file_str
            file_str = f.read()
            # print(file_str)
        print(len(queryset))
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
        # print(dem_value)
        s = StudentInfo.objects.filter(pk=value_studetId)[0]
        sf = s.fillstudentinfo_set.all()[0]
        print(sf.name, sf.job, sf.signature)

        print("---------")

        # settings.MEDIA_ROOT
        img_path = os.path.join(settings.MEDIA_ROOT, str(sf.signature))
        print(img_path)
        with open(img_path, 'rb') as img:  # 二进制方式打开图文件
            img_base64= base64.b64encode(img.read())
        
        # print(queryset.fillstudentinfo.all())
        print()
        print("---------")

        dem_up_value_replace = ["value_name", "value_sfz", "value_gender", "value_nation", "value_department",
                                "value_major",
                                "value_clazz", "value_studetId", "name_1", "job_1", "score_1", "signature_1"]
        for i in range(len(dem_up_value)):
            value_str = dem_up_value[i]
            pre_replace_str = dem_up_value_replace[i]
            file_str = re.sub(pre_replace_str, value_str, file_str)

        dem_down_value = []
        dem_down_value_replace = []
        for i in range(1,5):
            dem_down_value_replace.append(["name_{}".format(str(i)), "Job_{}".format(str(i)), "score_{}".format(str(i)),
                                           "signature_{}".format(str(i))])

        print(dem_down_value_replace)
        response = HttpResponse(content_type='application/vnd.ms-word')
        response['Content-Disposition'] = 'attachment; filename=test.doc'
        # ws.save(response)
        response.write(file_str)
        return response

    SaveExecl.short_description = "填表_量化测评"

    def get_democratic_score(self, instance):
        # exist_student = FillStudentInfo.objects.filter(filledStudentId_id=instance.studentId)
        # if exist_student:
        #     ave = 0
        #     nums = len(exist_student)
        #     for i in range(nums):
        #         ave += int(exist_student[i].score) / nums
        #     return "已有{}人评测，平均分：{}分".format(nums, ave)
        #     # return exist_student[0].score
        # else:
        return '暂未完成测评'

    get_democratic_score.short_description = '民主评议得分'
    get_democratic_score.is_column = True
    get_democratic_score.allow_tags = True
    get_democratic_score.admin_order_field = 'get_democratic_score'


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
