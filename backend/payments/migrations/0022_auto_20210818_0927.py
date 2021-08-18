# Generated by Django 3.2.6 on 2021-08-18 09:27

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('teams', '0005_auto_20210812_1538'),
        ('payments', '0021_alter_subscription_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stripecustomer',
            name='team',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='teams.team'),
        ),
        migrations.AlterField(
            model_name='subscription',
            name='team',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='teams.team'),
        ),
    ]