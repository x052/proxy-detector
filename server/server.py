from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import argparse
import sys
import tempfile

import itertools
import io
import zmq

import pandas as pd
from six.moves import urllib
import tensorflow as tf

CSV_COLUMNS = [
    "isProxy",
    "org",
    "continentCode",
    "countryCode"
]

org = tf.feature_column.categorical_column_with_hash_bucket(
    "org", hash_bucket_size=10000, dtype=tf.string)
continentCode = tf.feature_column.categorical_column_with_hash_bucket(
    "continentCode", hash_bucket_size=200, dtype=tf.string)
countryCode = tf.feature_column.categorical_column_with_hash_bucket(
    "countryCode", hash_bucket_size=400, dtype=tf.string)


# Wide columns and deep columns.
base_columns = [
    org, continentCode, countryCode
]

def build_estimator(model_dir):
  """Build an estimator."""
  m = tf.estimator.LinearClassifier(
    model_dir=model_dir, feature_columns=base_columns,
    optimizer=tf.train.FtrlOptimizer(
      learning_rate=0.1,
      l1_regularization_strength=1.0,
      l2_regularization_strength=1.0)
      )
  return m

def eval_fn(data_file, num_epochs, num_threads, shuffle):
  """Input builder function."""
  df_data = pd.read_csv(
      data_file,
      names=CSV_COLUMNS,
      skipinitialspace=True,
      engine="python",
      skiprows=1)
  # remove NaN elements
  df_data = df_data.dropna(how="any", axis=0)
  labels = df_data["isProxy"].apply(lambda x: x).astype(int)
  return tf.estimator.inputs.pandas_input_fn(
      x=df_data,
      y=None,
      batch_size=100,
      num_epochs=num_epochs,
      shuffle=shuffle,
      num_threads=num_threads)

model_dir = "../model"


m = build_estimator(model_dir)
context = zmq.Context()

#  Socket to talk to server
print("Connecting to the server…")
socket = context.socket(zmq.REP)
socket.connect("tcp://127.0.0.1:3000")

while True:
    message = socket.recv_string()
    print("Received reply %s" % message)
    predictions = m.predict(input_fn=eval_fn(io.StringIO(message), num_epochs=1, num_threads=1, shuffle=False))
    for p in predictions:
        socket.send_unicode(bytes.decode(p['classes'][0]))