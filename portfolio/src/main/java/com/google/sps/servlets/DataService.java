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

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.FetchOptions.Builder;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Handles all the datastore actions. */
public class DataService {

  private final DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

  public void saveComment(Comment comment) {
    Entity taskEntity = new Entity("Comment");
    taskEntity.setProperty("name", comment.getName());
    taskEntity.setProperty("timestamp", comment.getTime());
    taskEntity.setProperty("text", comment.getText());

    datastore.put(taskEntity);
  }

  public List<Comment> getComments(int commentLimit) {
    Query query = new Query("Comment").addSort("timestamp", SortDirection.DESCENDING);
    List<Comment> comments = new ArrayList<Comment>();

    List<Entity> results = 
    datastore.prepare(query).asList(FetchOptions.Builder.withLimit(commentLimit));
    
    for (Entity entity: results) {
      String name = (String) entity.getProperty("name");
      String text = (String) entity.getProperty("text");
      Comment myComment = new Comment(name, text);
      comments.add(myComment);
    }

    return comments;
  }

  public void deleteAllComments() {
    Query query = new Query("Comment");

    PreparedQuery results = datastore.prepare(query);
    results.asList(FetchOptions.Builder.withDefaults()).stream()
      .forEach(entity -> datastore.delete(entity.getKey()));
  }

  /** Puts markers into Datastore. */
  public void storeMarker(Marker marker) {
    Entity markerEntity = new Entity("Marker");
    markerEntity.setProperty("lat", marker.getLat());
    markerEntity.setProperty("lng", marker.getLng());
    markerEntity.setProperty("content", marker.getContent());

    datastore.put(markerEntity);
  }

  /** Fetches markers from Datastore. */
  public Collection<Marker> getMarkers() {
    Collection<Marker> markers = new ArrayList<>();

    Query query = new Query("Marker");
    PreparedQuery results = datastore.prepare(query);

    for (Entity entity : results.asIterable()) {
      double lat = (double) entity.getProperty("lat");
      double lng = (double) entity.getProperty("lng");
      String content = (String) entity.getProperty("content");

      Marker marker = new Marker(lat, lng, content);
      markers.add(marker);
    }
    return markers;
  }
}
