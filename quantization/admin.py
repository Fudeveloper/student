from django.contrib import admin

# Register your models here.

from quantization import models


class StudentInfoAdmin(admin.ModelAdmin):
    list_display = ('name', 'sfz', 'studentId', 'department', 'major', 'clazz', 'gender')
    search_fields = ('name', 'sfz', 'studentId')
    list_filter = ('clazz', "major", "gender")


admin.site.register(models.StudentInfo, StudentInfoAdmin)


class StudentAnswerAdmin(admin.ModelAdmin):
    list_display = ("studentId", "score")
    search_fields = ("studentId",)
    list_filter = (
        'zcdd', "jtzd", "mnxf", "fqzy", "mqzy", "fqld", "mqld", "cfmq", "fwqk", "jxrk", "syrk", "ylzc", "jtsz", "jtbg",
        "zxqj")
    ordering = ("-score",)


admin.site.register(models.StudentAnswer, StudentAnswerAdmin)
