# Generated by Django 2.1.1 on 2018-10-04 17:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('xnotesapp', '0006_user_salt'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='salt',
            field=models.CharField(default='d25zx', max_length=15),
        ),
    ]