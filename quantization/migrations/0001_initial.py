# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='StudentAnswer',
            fields=[
                ('id', models.AutoField(serialize=False, primary_key=True, verbose_name='ID', auto_created=True)),
                ('baseDatum', models.ImageField(null=True, upload_to='studentDatum', blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='StudentInfo',
            fields=[
                ('name', models.CharField(max_length=10)),
                ('sfz', models.CharField(max_length=18)),
                ('gender', models.CharField(max_length=2)),
                ('nation', models.CharField(max_length=20)),
                ('department', models.CharField(max_length=40)),
                ('major', models.CharField(max_length=40)),
                ('clazz', models.CharField(max_length=40)),
                ('studentId', models.CharField(serialize=False, max_length=11, primary_key=True, unique=True)),
            ],
        ),
        migrations.AddField(
            model_name='studentanswer',
            name='studentId',
            field=models.ForeignKey(related_name='StudentAnswer', to='quantization.StudentInfo'),
        ),
    ]
