# from django.contrib import admin

from democratic import models
import xadmin as admin

from democratic.models import FillStudentInfo
from quantization.models import StudentInfo


class FillStudentInfoAdmin(object):
    list_display = ('filledStudentId', 'name', 'job', 'score',)
    search_fields = ('filledStudentId', 'name')

    # list_filter = ('clazz', "major", "gender")

    # def get_studentinfo_name(self, instance):
    #     si1 = StudentInfo.objects.filter(studentId="2016011913")[0]
    #     si1.FillStudentInfo.add(instance)
    #     # a1 = FillStudentInfo.objects.filter(pk=instance.pk)[0]
    #     # instance.filledStudentId.add(si1)
    #     # exist_student = StudentInfo.objects.filter(pk=)
    #     #
    #     # if exist_student:
    #     #     return exist_student[0].name
    #     # else:
    #     return si1.pk
    #
    # get_studentinfo_name.short_description = '受评测人姓名'
    # get_studentinfo_name.is_column = True
    # get_studentinfo_name.allow_tags = True


admin.site.register(models.FillStudentInfo, FillStudentInfoAdmin)
