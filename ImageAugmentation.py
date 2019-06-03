import glob
import cv2
import tensorflow as tf
import numpy as np
import PIL.Image as Image
from math import pi

dataset_types = ["defect_bottle", "perfect_bottle", "without_cap"]

IMAGE_SIZE = 192


def save_augmented_images(image_array, image_path):
    i=0
    for img in image_array:
        i+=1
        image_pil = Image.fromarray(np.uint8(img)).convert('RGB')
        name = image_path + str(i) + '.jpg'
        image_pil.save(name)


def add_gaussian_noise(X_imgs, datasetType):
    try:
        gaussian_noise_imgs = []
        row, col, _ = X_imgs[0].shape
        # Gaussian distribution parameters
        mean = 0
        var = 0.1
        sigma = var ** 0.5
        for X_img in X_imgs:
            gaussian = np.random.random((row, col, 1)).astype(np.float32)
            gaussian = np.concatenate((gaussian, gaussian, gaussian), axis = 2)
            gaussian_img = cv2.addWeighted(X_img, 0.75, 0.25 * gaussian, 0.25, 0)
            gaussian_noise_imgs.append(gaussian_img)
        gaussian_noise_imgs = np.array(gaussian_noise_imgs, dtype = np.float32)
        imagePath = "dataset/"+datasetType+"/" + "gaussian_noise"
        save_augmented_images(gaussian_noise_imgs, imagePath)
    except Exception as ex:
        print('')

def central_scale_images(X_imgs, scales,datasetType):
    # Various settings needed for Tensorflow operation
    boxes = np.zeros((len(scales), 4), dtype=np.float32)
    for index, scale in enumerate(scales):
        x1 = y1 = 0.5 - 0.5 * scale  # To scale centrally
        x2 = y2 = 0.5 + 0.5 * scale
        boxes[index] = np.array([y1, x1, y2, x2], dtype=np.float32)
    box_ind = np.zeros((len(scales)), dtype=np.int32)
    crop_size = np.array([IMAGE_SIZE, IMAGE_SIZE], dtype=np.int32)

    X_scale_data = []
    tf.reset_default_graph()
    X = tf.placeholder(tf.float32, shape=(1, IMAGE_SIZE, IMAGE_SIZE, 3))
    # Define Tensorflow operation for all scales but only one base image at a time
    tf_img = tf.image.crop_and_resize(X, boxes, box_ind, crop_size)
    with tf.Session() as sess:
        sess.run(tf.global_variables_initializer())

        for img_data in X_imgs:
            batch_img = np.expand_dims(img_data, axis=0)
            scaled_imgs = sess.run(tf_img, feed_dict={X: batch_img})
            X_scale_data.extend(scaled_imgs)

    X_scale_data = np.array(X_scale_data, dtype=np.float32)
    imagePath = "dataset/" + datasetType + "/" + "scaled_image"
    save_augmented_images(X_scale_data, imagePath)


def rotate_images(X_imgs, start_angle, end_angle, n_images,datasetType):
    X_rotate = []
    iterate_at = (end_angle - start_angle) / (n_images - 1)

    tf.reset_default_graph()
    X = tf.placeholder(tf.float32, shape=(None, IMAGE_SIZE, IMAGE_SIZE, 3))
    radian = tf.placeholder(tf.float32, shape=(len(X_imgs)))
    tf_img = tf.contrib.image.rotate(X, radian)
    with tf.Session() as sess:
        sess.run(tf.global_variables_initializer())

        for index in range(n_images):
            degrees_angle = start_angle + index * iterate_at
            radian_value = degrees_angle * pi / 180  # Convert to radian
            radian_arr = [radian_value] * len(X_imgs)
            rotated_imgs = sess.run(tf_img, feed_dict={X: X_imgs, radian: radian_arr})
            X_rotate.extend(rotated_imgs)

    X_rotate = np.array(X_rotate, dtype=np.float32)
    imagePath = "dataset/" + datasetType + "/" + "rotated_image"
    save_augmented_images(X_rotate, imagePath)

def flip_images(X_imgs,datasetType):
    X_flip = []
    tf.reset_default_graph()
    X = tf.placeholder(tf.float32, shape=(IMAGE_SIZE, IMAGE_SIZE, 3))
    tf_img1 = tf.image.flip_left_right(X)
    tf_img2 = tf.image.flip_up_down(X)
    tf_img3 = tf.image.transpose_image(X)
    with tf.Session() as sess:
        sess.run(tf.global_variables_initializer())
        for img in X_imgs:
            flipped_imgs = sess.run([tf_img1, tf_img2, tf_img3], feed_dict={X: img})
            X_flip.extend(flipped_imgs)
    X_flip = np.array(X_flip, dtype=np.float32)

    imagePath = "dataset/" + datasetType + "/" + "flipped_image"
    save_augmented_images(X_flip, imagePath)

def tf_resize_images(datasetType):
    X_data = []
    tf.reset_default_graph()
    X = tf.placeholder(tf.float32, (None, None, 3))
    tf_img = tf.image.resize_images(X, (IMAGE_SIZE, IMAGE_SIZE),
                                    tf.image.ResizeMethod.NEAREST_NEIGHBOR)
    with tf.Session() as sess:
        sess.run(tf.global_variables_initializer())
        filenames = glob.glob("dataset/"+datasetType+"/*.jpg")
        filenames.sort()
        for img in filenames:
            image_data=cv2.imread(img)
            resized_img = sess.run(tf_img, feed_dict={X: image_data})
            X_data.append(resized_img)
    X_data = np.array(X_data, dtype=np.float32)  # Convert to numpy
    return X_data

def main_augment():
    for datasetClass in dataset_types:
        X_imgs = tf_resize_images(datasetClass)
        add_gaussian_noise(X_imgs,datasetClass)
        central_scale_images(X_imgs, [0.95], datasetClass)
        rotate_images(X_imgs, -60, 60, 3, datasetClass)
        flip_images(X_imgs, datasetClass)
        print(" Augmented images created for " + datasetClass + "..!")

#main_augment()






























#from keras.models import load_model
#import os

# if not os.path.exists('models/'):
#     os.makedirs('models/')
# elif not os.path.exists('models' + '/model1.h5'):
#     print('creating a new model.....')
# import tensorflow as tf
#
# model = load_model("models\\model1.h5")
# print(model)
# #test_image = image.load_img("c3.jpeg", target_size = (150, 150))
# tf.image.crop_to_bounding_box()
# print('Training starts at ====> ' + str(int(datetime.datetime.now().timestamp())) + '\n\n')
# print('Training starts at ====> ' + datetime.datetime.now().strftime('%H:%M:%S') + '\n\n')
# print(os.getcwd()+'\Testing_Directory\image'+str(datetime.datetime.now())+'.jpeg')
# display_str = '{}: {}%'.format(
#     "hi","hello")
# display_str =display_str+" predic"
# #display_str+"perfect"
# print(display_str)












# import sys
# import os
# import Prediction
# from keras.preprocessing.image import ImageDataGenerator
# from keras.preprocessing import image
# from keras import optimizers
# from keras.models import Sequential
# from keras.layers import Dropout, Flatten, Dense, Activation
# from keras.layers.convolutional import Convolution2D, MaxPooling2D
# from keras import callbacks
# import numpy as np
# import object_detection_webcam
# object_detection_webcam.frameSave()
# DEV = False
# argvs = sys.argv
# argc = len(argvs)
#
# if argc > 1 and (argvs[1] == "--development" or argvs[1] == "-d"):
#   DEV = True
#
# if DEV:
#   epochs = 2
# else:
#   epochs = 20
#
# train_data_path = 'dataset/'
# validation_data_path = 'dataset/'
#
# """
# Parameters
# """
# img_width, img_height = 150, 150
# batch_size = 32
# samples_per_epoch = 1000
# validation_steps = 300
# nb_filters1 = 32
# nb_filters2 = 64
# conv1_size = 3
# conv2_size = 2
# pool_size = 2
# classes_num = 3
# lr = 0.0004
#
# model = Sequential()
# model.add(Convolution2D(nb_filters1, conv1_size, conv1_size, border_mode ="same", input_shape=(img_width, img_height, 3)))
# model.add(Activation("relu"))
# model.add(MaxPooling2D(pool_size=(pool_size, pool_size)))
#
# model.add(Convolution2D(nb_filters2, conv2_size, conv2_size, border_mode ="same"))
# model.add(Activation("relu"))
# model.add(MaxPooling2D(pool_size=(pool_size, pool_size), dim_ordering='th'))
#
# model.add(Flatten())
# model.add(Dense(256))
# model.add(Activation("relu"))
# model.add(Dropout(0.5))
# model.add(Dense(classes_num, activation='softmax'))
#
# model.compile(loss='categorical_crossentropy',
#               optimizer=optimizers.RMSprop(lr=lr),
#               metrics=['accuracy'])
#
# train_datagen = ImageDataGenerator(
#     rescale=1. / 255,
#     shear_range=0.2,
#     zoom_range=0.2,
#     horizontal_flip=True)
#
# test_datagen = ImageDataGenerator(rescale=1. / 255)
#
# train_generator = train_datagen.flow_from_directory(
#     train_data_path,
#     target_size=(img_height, img_width),
#     batch_size=batch_size,
#     class_mode='categorical')
#
# validation_generator = test_datagen.flow_from_directory(
#     validation_data_path,
#     target_size=(img_height, img_width),
#     batch_size=batch_size,
#     class_mode='categorical')
#
# """
# Tensorboard log
# """
# log_dir = './tf-log/'
# tb_cb = callbacks.TensorBoard(log_dir=log_dir, histogram_freq=1)
# cbks = [tb_cb]
#
# model.fit_generator(
#     train_generator,
#     samples_per_epoch=samples_per_epoch,
#     epochs=epochs,
#     validation_data=validation_generator,
#     #callbacks=cbks,
#     validation_steps=validation_steps)
#
# #test_image = image.load_img('c2.jpeg', target_size = (150, 150))
# images = []
# result=[]
# folder="Testing_Directory"
# for filename in os.listdir(folder):
#   img = cv2.imread(os.path.join(folder,filename))
#   if img is not None:
#     images.append(img)
# for i in range(0,len(images)):
#   test_image = image.img_to_array(image[i])
#   test_image = np.expand_dims(test_image,axis=0)
#   result = model.predict(test_image)
#   train_generator.class_indices
#
#   if result[0][0] == 1:
#     prediction = 'defect'
#   elif result[0][1]==1:
#     prediction = 'pefect'
#   elif result[0][2]==1:
#     prediction = 'with out cap'
#   result.append(prediction)
#   print('so the bottle is '+prediction)
# for i in range(0,len(images)):
#   image_name=os.path.split(images[i])[-1]
#   print(image_name,result[i])
#
# #img=image.load_img('1.jpg',target_size = (150, 150, 150))
# #img=image.img_to_array(img)
# #img=np.expand_dims(img,axis=0)
# #a=model.predict(img)
# #print(a)
#
# target_dir = 'models/'
# if not os.path.exists(target_dir):
#   os.mkdir(target_dir)
# model.save('./models/model1.h5')
# model.save_weights('./models/weights1.h5')
