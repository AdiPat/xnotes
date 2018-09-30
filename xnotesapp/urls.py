from django.urls import path

from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('xnote/<slug:username>/', views.home, name='home'),
    path('xnote/<slug:username>/create', views.create, name='create'),
    path('xnote/<slug:username>/delete', views.delete, name='delete'),
    path('xnote/<slug:username>/label', views.label, name='label'),
    path('xnote/<slug:username>/<slug:id_hash>', views.edit, name='edit'),
]