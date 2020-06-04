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

import com.google.gson.Gson;
import com.google.sps.servlets.Comment;
import com.google.sps.servlets.DataService;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/data")
public class DataServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    List<Comment> commentsList = new ArrayList<Comment>();
    DataService dataservice = new DataService();
    int maxNumComments = getLimit(request);
    //Math.min(getLimit(request), comments.size());
    commentsList = dataservice.getComments(maxNumComments);

    Gson gson = new Gson();
    String json = gson.toJson(commentsList);

    response.setContentType("application/json;");
    response.getWriter().println(json);

  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String name = request.getParameter("name");
    long timestamp = System.currentTimeMillis();
    String text = request.getParameter("comment-text");

    DataService dataservice = new DataService();
    dataservice.makeEntity(name, timestamp, text);

    response.sendRedirect("/index.html");
  }

  @Override
  public void doDelete(HttpServletRequest request, HttpServletResponse response) throws IOException {
    DataService dataservice = new DataService();
    dataservice.deleteAll();
  }

  /**
   * Takes request and gets its comment-limit parameter.
   * Default limit is 3 if val can't be read.
   * @param {request} request from get
   * @return {commentLimit} max # of comments to show
   */
  private int getLimit(HttpServletRequest request) {
    String commentLimitString = request.getParameter("comment-limit");
    int commentLimit;

    try {
      commentLimit = Integer.parseInt(commentLimitString);
    } catch (NumberFormatException e) {
        return 3;
    }

    return commentLimit;
  }

}
