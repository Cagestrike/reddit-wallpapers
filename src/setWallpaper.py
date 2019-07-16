# import sys
# print('D:\IT\\reddit-wallpapers\src\\test.jpg')
# sys.stdout.flush()

import ctypes
import sys
import os
import urllib
import requests
import time


imageURL = sys.argv[1]
imageName = sys.argv[2]

print(imageURL)
print(imageName)

print('current directory: ', os.path.abspath(os.curdir))

savePath = os.path.join(os.curdir, 'wallpapers')

print('save path: ', os.path.abspath(savePath))
if not os.path.exists(savePath):
    os.mkdir(savePath)

imagePath = os.path.join(savePath, imageName)
print('image path: ', os.path.abspath(imagePath))

if os.path.exists(imagePath):
    print('Image already downloaded')
else:
    open(imagePath, "wb").write(urllib.request.urlopen(imageURL).read())

ctypes.windll.user32.SystemParametersInfoW(
    20, 0, os.path.abspath(imagePath), 1)

time.sleep(2)

os.remove(imagePath)
