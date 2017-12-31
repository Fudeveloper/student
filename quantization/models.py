from django.db import models


# Create your models here.
class StudentInfo(models.Model):
    # 不写则，django默认创建ID列，自增，主键
    # 用户名列，字符串类型，指定长度
    name = models.CharField(max_length=10)
    sfz = models.CharField(max_length=18)
    gender = models.CharField(max_length=2)
    nation = models.CharField(max_length=20)
    department = models.CharField(max_length=40)
    major = models.CharField(max_length=40)
    clazz = models.CharField(max_length=40)
    studentId = models.CharField(max_length=11, primary_key=True, unique=True)

# class