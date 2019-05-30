from __future__ import absolute_import, division, print_function, unicode_literals
import tensorflow as tf
from tensorflow import keras
import datetime
from keras.utils import CustomObjectScope
from keras.initializers import glorot_uniform
from tensorflow.keras import layers
def trainmodel():
	try:
		f = open("training.txt", 'w')
		f.write("time starts at===========>",+ datetime.datetime.now().strftime('%H:%M:%S') + '\n\n')
		f.close()
	except Exception as e:
		print("error", e)
		  
	ImageDataGenerator=tf.keras.preprocessing.image.ImageDataGenerator
	train_data_path = 'dataset/'
	validation_data_path = 'dataset/'
	tf.keras.backend.clear_session() 
	inputs = keras.Input(shape=(192, 192, 3), name='img')
	x = layers.Conv2D(32, 3, activation='relu')(inputs)
	x = layers.Conv2D(64, 3, activation='relu')(x)
	block_1_output = layers.MaxPooling2D(3)(x)

	x = layers.Conv2D(64, 3, activation='relu', padding='same')(block_1_output)
	x = layers.Conv2D(64, 3, activation='relu', padding='same')(x)
	block_2_output = layers.add([x, block_1_output])

	x = layers.Conv2D(64, 3, activation='relu', padding='same')(block_2_output)
	x = layers.Conv2D(64, 3, activation='relu', padding='same')(x)
	block_3_output = layers.add([x, block_2_output])

	x = layers.Conv2D(64, 3, activation='relu')(block_3_output)
	x = layers.GlobalAveragePooling2D()(x)
	x = layers.Dense(256, activation='relu')(x)
	x = layers.Dropout(0.5)(x)

	outputs = layers.Dense(3, activation='softmax')(x)

	model = keras.Model(inputs, outputs, name='CNN')

	model.compile(optimizer=keras.optimizers.RMSprop(1e-3),
		      loss='categorical_crossentropy',
		      metrics=['acc'])
	train_datagen = ImageDataGenerator(
	    rescale=1./255,
	    shear_range=0.2,
	    zoom_range=0.2,
	    horizontal_flip=True)
	test_datagen = ImageDataGenerator(rescale=1./255)
	train_generator = train_datagen.flow_from_directory(
	    train_data_path,
	    target_size=(192, 192),
	    batch_size=32,
	    class_mode='categorical')
	validation_generator = test_datagen.flow_from_directory(
	    validation_data_path,
	    target_size=(192, 192),
	    batch_size=32,
	    class_mode='categorical')
	model.fit_generator(
	    train_generator,
	    steps_per_epoch=2000,
	    epochs=50,
	    validation_data=validation_generator,
	    validation_steps=800)

	model.save('./functionalmodel/FunCModel.h5')
	try:
		f = open("training.txt", 'w')
		f.write("time ends at===========>",+ datetime.datetime.now().strftime('%H:%M:%S') + '\n\n')
		f.close()
	except Exception as e:
		print("error", e)
		   



