from django.db import models

# Create your models here.
class StudentInfo(models.Model):
    # 不写则，django默认创建ID列，自增，主键
    # 用户名列，字符串类型，指定长度
    # 姓名
    name = models.CharField(max_length=10, verbose_name="姓名")
    # 身份证号码
    sfz = models.CharField(max_length=18, verbose_name="身份证号码")
    # 性别
    gender = models.CharField(max_length=2, verbose_name="性别")
    # 民族
    nation = models.CharField(max_length=20, verbose_name="民族")
    # 院系
    department = models.CharField(max_length=40, verbose_name="院系")
    # 专业
    major = models.CharField(max_length=40, verbose_name="专业")
    # 班级
    clazz = models.CharField(max_length=40, verbose_name="班级")
    # 学号
    studentId = models.CharField(max_length=11, primary_key=True, unique=True, verbose_name="学号")

    def __str__(self):
        # return self.studentId+"__"+self.name
        return self.studentId

    class Meta:
        verbose_name = '学生信息'
        verbose_name_plural = '学生信息'


class StudentAnswer(models.Model):
    # 学号
    studentId = models.OneToOneField(StudentInfo, on_delete=models.CASCADE, related_name='StudentAnswer', unique=True,
                                     primary_key=True, verbose_name="学号")
    # 政策兜底资助类型
    baseDatum = models.ImageField(null=True, blank=True, verbose_name="政策兜底资助类型" )

    def __str__(self):
        return self.pk


    # # 父亲劳动能力证明
    fatherDatum = models.ImageField(null=True, blank=True, verbose_name="父亲劳动能力证明")
    # father = models.CharField(max_length=80)
    #
    # # 母亲劳动能力证明
    motherDatum = models.ImageField(null=True, blank=True, verbose_name="母亲劳动能力证明")
    # mother = models.CharField(max_length=80)
    #
    # # 医疗支出证明
    medicalDatum = models.ImageField(null=True, blank=True, verbose_name="医疗支出证明")
    # medical = models.CharField(max_length=80)
    #
    # # 家庭受灾证明
    disasterDatum = models.ImageField(null=True, blank=True, verbose_name="家庭受灾证明")
    # disaster = models.CharField(max_length=80)
    #
    # # 家庭变故证明
    eventDatum = models.ImageField(null=True, blank=True, verbose_name="家庭变故证明")
    # event = models.CharField(max_length=80)

    # 政策兜底
    zcdd = models.CharField(max_length=80, null=True, blank=True, verbose_name="政策兜底")
    # 户籍所在县区
    hjsz = models.CharField(max_length=80, null=True, blank=True, verbose_name="户籍所在县区")
    # 家庭住地
    jtzd = models.CharField(max_length=80, null=True, blank=True, verbose_name="家庭住地")
    # 每年学费标准
    mnxf = models.CharField(max_length=80, null=True, blank=True, verbose_name="每年学费标准")
    # 父亲职业
    fqzy = models.CharField(max_length=80, null=True, blank=True, verbose_name="父亲职业")
    # 母亲职业
    mqzy = models.CharField(max_length=80, null=True, blank=True, verbose_name="母亲职业")
    # 父亲劳动能力
    fqld = models.CharField(max_length=80, null=True, blank=True, verbose_name="父亲劳动能力")
    # 母亲劳动能力
    mqld = models.CharField(max_length=80, null=True, blank=True, verbose_name="母亲劳动能力")
    # 除父母亲之外其他家庭成员劳动能力
    cfmq = models.CharField(max_length=80, null=True, blank=True, verbose_name="除父母亲之外其他家庭成员劳动能力")
    # 房屋情况
    fwqk = models.CharField(max_length=80, null=True, blank=True, verbose_name="房屋情况")
    # 就学人口
    jxrk = models.CharField(max_length=80, null=True, blank=True, verbose_name="就学人口")
    # 赡养人口
    syrk = models.CharField(max_length=80, null=True, blank=True, verbose_name="赡养人口")
    # 医疗支出
    ylzc = models.CharField(max_length=80, null=True, blank=True, verbose_name="医疗支出")
    # 家庭受灾
    jtsz = models.CharField(max_length=80, null=True, blank=True, verbose_name="家庭受灾")
    # 家庭变故
    jtbg = models.CharField(max_length=80, null=True, blank=True, verbose_name="家庭变故")
    # 在校期间获得国家或学校资助情况
    zxqj = models.CharField(max_length=80, null=True, blank=True, verbose_name="在校期间获得国家或学校资助情况")
    # # 测评得分
    score = models.CharField(max_length=10, null=True, blank=True, verbose_name="测评得分")

    class Meta:
        verbose_name = '学生量化评测数据'
        verbose_name_plural = '学生量化评测数据'


