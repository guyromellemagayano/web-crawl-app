# Generated by Django 3.2.6 on 2021-08-18 08:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0012_auto_20210818_0829'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usersubscription',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
