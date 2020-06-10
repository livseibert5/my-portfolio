// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

/** Represents a comment with the user's name, text, and timestamp. */
public final class Comment {

  private final String name;
  private final long timestamp;
  private final String text;

  public Comment(String name, String text) {
    this.timestamp = System.currentTimeMillis();
    this.name = name;
    this.text = text;
  }

  public String getName() {
    return name;
  }

  public long getTime() {
    return timestamp;
  }

  public String getText() {
    return text;
  }
}
