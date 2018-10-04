from django.urls import path

from . import views


urlpatterns = [
    path('', views.index, name='index'),
    path('xnote/<slug:username>/', views.home, name='home'),
    path('xnote/<slug:username>/notes', views.all, name='all'),
    path('xnote/<slug:username>/create', views.create, name='create'),
    path('xnote/<slug:username>/delete', views.delete, name='delete'),
    path('xnote/<slug:username>/label', views.label, name='label'),
    path('xnote/<slug:username>/<slug:note_id>', views.edit, name='edit'),
    path('xnote/login', views.login, name='login'),
    path('xnote/signup', views.signup, name='signup'),
]