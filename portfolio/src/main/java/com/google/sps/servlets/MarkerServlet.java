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
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

/**
 * Servlet that handles the creation and storage of
 * a new marker when the user clicks on the map.
 */
@WebServlet("/markers")
public final class MarkerServlet extends HttpServlet {

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    response.setContentType("application/json");

    DataService dataService = new DataService();
    Collection<Marker> markers = dataService.getMarkers();
    Gson gson = new Gson();
    String json = gson.toJson(markers);

    response.getWriter().println(json);
  }

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) {
    double latitude = Double.parseDouble(request.getParameter("latitude"));
    double longitude = Double.parseDouble(request.getParameter("longitude"));
    String content = Jsoup.clean(request.getParameter("content"), Whitelist.none());

    Marker marker = new Marker(latitude, longitude, content);

    DataService dataService = new DataService();
    dataService.storeMarker(marker);
  }
}
