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

import java.util.Arrays;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public final class FindMeetingQuery {
  public Collection<TimeRange> query(Collection<Event> events, MeetingRequest request) {

    boolean onlyOptional = false;
    //see if no attendees were requested or if the requested meeting is too long
    Collection<String> attendeesRequested = request.getAttendees();
    if (attendeesRequested.size() == 0) {
      if (request.getOptionalAttendees().size() == 0) {
        return Arrays.asList(TimeRange.WHOLE_DAY);
      }
      else {
        attendeesRequested = request.getOptionalAttendees();
        onlyOptional = true;
      }
    }
    if (request.getDuration() > TimeRange.WHOLE_DAY.duration()) {
      return new ArrayList<TimeRange>();
    }
    
    //see which events our requested attendees are attending
    List<Event> imptEvents = new ArrayList<Event>();
    List<TimeRange> optionalTimes = new ArrayList<TimeRange>();
    for (Event event: events) {
      Set<String> overlap = new HashSet<String>(attendeesRequested);
      overlap.retainAll(event.getAttendees());
      if (overlap.size() != 0) {
        imptEvents.add(event);
      }
      else {
        if (onlyOptional == false) {
          optionalTimes.add(event.getWhen());
        }
      }
    }

    //if none of the requested attendees are busy the meeting can be any time
    if (imptEvents.size() == 0) {
      return Arrays.asList(TimeRange.WHOLE_DAY);
    }

    //put all the time ranges of these events into a set
    List<TimeRange> eventTimes = imptEvents.stream().map(Event::getWhen).collect(Collectors.toList());

    //use first start time and last end time to find free time
    Collections.sort(eventTimes, TimeRange.ORDER_BY_END);
    int end = eventTimes.get(eventTimes.size()-1).end();
    Collections.sort(eventTimes, TimeRange.ORDER_BY_START);
    int start = eventTimes.get(0).start();

    List<TimeRange> freeTimes = new ArrayList<TimeRange>();
    freeTimes.add(TimeRange.fromStartEnd(TimeRange.START_OF_DAY, start, false));
    freeTimes.add(TimeRange.fromStartEnd(end, TimeRange.END_OF_DAY, true));

    //loop through events to find free time
    for (int i=0; i<eventTimes.size()-1; i++) {
      for (int j=i+1; j<eventTimes.size(); j++) {
        TimeRange range1 = imptEvents.get(i).getWhen();
        TimeRange range2 = imptEvents.get(j).getWhen();

        //if the current meeting contains the next one, compare to the next next
        if (range1.contains(range2)) {
          continue;
        }

        //if current event overlaps next, move to the next outer loop
        else if (range1.overlaps(range2)) {
          break;
        }

        //if neither overlap nor contains, we've found free time
        else {
          freeTimes.add(TimeRange.fromStartEnd(range1.end(), range2.start(), false));
          break;
        }
      }
    }
    
    //check if the time slots we've found are long enough for requested meeting
    List<TimeRange> longFreeTimes = freeTimes.stream()
        .filter(range -> range.duration() >= request.getDuration()).collect(Collectors.toList());

    Collections.sort(longFreeTimes, TimeRange.ORDER_BY_START);
    
    //sees if optional attendees can be included
    List<TimeRange> optionalAttendeesIncluded = new ArrayList<TimeRange>();
    for (TimeRange time: longFreeTimes) {
      for (TimeRange optionalTime: optionalTimes) {
        if (time.contains(optionalTime)) {
          continue;
        }
        optionalAttendeesIncluded.add(time);
      }
    }
    
    if (optionalAttendeesIncluded.size() != 0) {
      return optionalAttendeesIncluded;
    }

    return longFreeTimes;
  }
}
