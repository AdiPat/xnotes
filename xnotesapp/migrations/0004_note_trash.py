# Generated by Django 2.1.1 on 2018-10-02 13:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('xnotesapp', '0003_note_pinned'),
    ]

    operations = [
        migrations.AddField(
            model_name='note',
            name='trash',
            field=models.BooleanField(default=False),
        ),
    ]