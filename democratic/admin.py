from django.contrib import admin

from democratic import models


class FillStudentInfoAdmin(admin.ModelAdmin):
    list_display = ('filledStudentId', 'name', 'job', 'score', 'signature')
    search_fields = ('filledStudentId', 'name')
    # list_filter = ('clazz', "major", "gender")


admin.site.register(models.FillStudentInfo, FillStudentInfoAdmin)
