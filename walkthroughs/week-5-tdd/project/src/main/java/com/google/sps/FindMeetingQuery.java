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

package com.google.sps;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {

    //see if no attendees were requested or if the requested meeting is too long
    Collection<String> attendeesRequested = request.getAttendees();
    if (attendeesRequested.size() == 0) {
      return Arrays.asList(TimeRange.WHOLE_DAY);
    }
    if (request.getDuration() > TimeRange.WHOLE_DAY.duration()) {
      return new ArrayList<TimeRange>();
    }
    
    //see which events our requested attendees are attending
    List<Event> imptEvents = new ArrayList<Event>();
    for (Event event: events) {
      for (String attendee: attendeesRequested) {
        if (event.getAttendees().contains(attendee)) {
          imptEvents.add(event);
        }
      }
    }

    if (imptEvents.size() == 0) {
      return Arrays.asList(TimeRange.WHOLE_DAY);
    }

    //put all the time ranges of these events into a set, sort
    List<TimeRange> eventTimes = new ArrayList<TimeRange>();
    for (Event event: imptEvents) {
      eventTimes.add(event.getWhen());
    }
    Collections.sort(eventTimes, TimeRange.ORDER_BY_END);
    int end = eventTimes.get(eventTimes.size()-1).end();
    Collections.sort(eventTimes, TimeRange.ORDER_BY_START);
    List<TimeRange> freeTimes = new ArrayList<TimeRange>();
    int start = eventTimes.get(0).start();
    freeTimes.add(TimeRange.fromStartEnd(TimeRange.START_OF_DAY, start, false));
    freeTimes.add(TimeRange.fromStartEnd(end, TimeRange.END_OF_DAY, true));

    for (int i=0; i<eventTimes.size()-1; i++) {
      for (int j=i+1; j<eventTimes.size(); j++) {
        TimeRange range1 = imptEvents.get(i).getWhen();
        TimeRange range2 = imptEvents.get(j).getWhen();

        //if the current meeting contains the next one, compare to the third
        if (range1.contains(range2)) {
          continue;
        }

        //if current event overlaps next
        else if (range1.overlaps(range2)) {
          break;
        }

        //if neither overlap nor contains
        else {
          freeTimes.add(TimeRange.fromStartEnd(range1.end(), range2.start(), false));
          break;
        }
      }
    }
    
    List<TimeRange> longFreeTimes = new ArrayList<TimeRange>();
    for (TimeRange time: freeTimes) {
      if (time.duration() >= request.getDuration()-1) {
        longFreeTimes.add(time);
      }
    }
    
    Collections.sort(longFreeTimes, TimeRange.ORDER_BY_START);
    return longFreeTimes;
  }
}
