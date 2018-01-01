from django.db import models


# Create your models here.
class StudentInfo(models.Model):
    # 不写则，django默认创建ID列，自增，主键
    # 用户名列，字符串类型，指定长度
    # 姓名
    name = models.CharField(max_length=10)
    # 身份证号码
    sfz = models.CharField(max_length=18)
    # 性别
    gender = models.CharField(max_length=2)
    # 民族
    nation = models.CharField(max_length=20)
    # 院系
    department = models.CharField(max_length=40)
    # 专业
    major = models.CharField(max_length=40)
    # 班级
    clazz = models.CharField(max_length=40)
    # 学号
    studentId = models.CharField(max_length=11, primary_key=True, unique=True)

    def __str__(self):
        return self.name


class StudentAnswer(models.Model):
    # 学号
    studentId = models.ForeignKey(StudentInfo, on_delete=models.CASCADE, related_name='StudentAnswer')
    # 政策兜底资助类型
    baseDatum = models.ImageField(null=True, blank=True, upload_to='studentDatum')

    def __str__(self):
        return "xuehao"
        # base = models.CharField(max_length=80)
        #
        # # 父亲劳动能力证明
        # fatherDatum = models.ImageField(null=True, blank=True)
        # father = models.CharField(max_length=80)
        #
        # # 母亲劳动能力证明
        # motherDatum = models.ImageField(null=True, blank=True)
        # mother = models.CharField(max_length=80)
        #
        # # 医疗支出证明
        # medicalDatum = models.ImageField(null=True, blank=True)
        # medical = models.CharField(max_length=80)
        #
        # # 家庭受灾证明
        # disasterDatum = models.ImageField(null=True, blank=True)
        # disaster = models.CharField(max_length=80)
        #
        # # 家庭变故证明
        # eventDatum = models.ImageField(null=True, blank=True)
        # event = models.CharField(max_length=80)
        #
        # # 户籍所在县区
        # hjsz = models.CharField(max_length=80)
        # # 家庭住地
        # jtzd = models.CharField(max_length=80)
        # # 每年学费标准
        # mnxf = models.CharField(max_length=80)
        # # 父亲职业
        # fqzy = models.CharField(max_length=80)
        # # 母亲职业
        # mqzy = models.CharField(max_length=80)
        # # 父亲劳动能力
        # fqld = models.CharField(max_length=80)
        # # 母亲劳动能力
        # mqld = models.CharField(max_length=80)
        # # 除父母亲之外其他家庭成员劳动能力
        # cfmq = models.CharField(max_length=80)
        # # 房屋情况
        # fwqk = models.CharField(max_length=80)
        # # 就学人口
        # jxrk = models.CharField(max_length=80)
        # # 赡养人口
        # syrk = models.CharField(max_length=80)
        # # 在校期间获得国家或学校资助情况
        # jtbg = models.CharField(max_length=80)
        # # 测评得分
        # score = models.CharField(max_length=10)
