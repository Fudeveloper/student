from django.db import models
from quantization.models import StudentInfo


# Create your models here.
# 评测人信息
class FillStudentInfo(models.Model):
    # models.ManyToManyField()
    filledStudentId = models.ManyToManyField(StudentInfo,
                                             verbose_name="受评测人学号")
    name = models.CharField(null=True, blank=True, max_length=10, verbose_name="评测人姓名")

    job = models.CharField(null=True, blank=True, max_length=40, verbose_name="职务")

    score = models.CharField(null=True, blank=True, max_length=40, verbose_name="评议得分")

    signature = models.ImageField(null=True, blank=True, verbose_name="签字图片")

    # def __str__(self):
    #     return self.filledStudentId

    class Meta:
        verbose_name = '民主评议'
        verbose_name_plural = '民主评议'
