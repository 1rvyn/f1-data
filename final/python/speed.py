import sys, getopt, time
import fastf1 as ff1
import numpy as np
import matplotlib as mpl

from matplotlib import pyplot as plt
from matplotlib.collections import LineCollection

# change to the codio boxes directory
ff1.Cache.enable_cache('/Users/irvyn/github-classroom/CM2104-DynamicWebDevelopment/cm2104-project-2122-group_f/final/python/cache') 

##############################################################################
# we need inputs here but i will slice a sinuglar string that i will create server side
# for instance the example inputs were hard coded and their singular string would be :
# 202109RRIC -
# slice first 4 chars for the year - the next 2 with some formatting to get wknd the next singular char is ses last 3 is driver

# s_input = "202109RRIC"
# year = 2021   roundNumber = 09     raceType = R    driverName = RIC 
# year = str(s_input[0:4])
# wknd = str(s_input[4:6])
# racetype = str(s_input[6:7])
# driver = str(s_input[7:10])
s_input = sys.argv[1]
year = (s_input[0:4])
temp_wknd = (s_input[4:6])
# because if we have to have the weekend be a 2 digit number for slicing properly from just 1 string
# wknd = round (http://ergast.com/api/f1/2020) - example of rounds for the year 2020
if(temp_wknd[0:0] == 0):
    wknd = int(temp_wknd[1:1])
else:
    wknd = int(temp_wknd)
ses = s_input[6:7]
driver = str(s_input[7:10])
print("year :" + year)
print(wknd)
print("session :" + ses)
print("driver :" + driver)
colormap = mpl.cm.plasma


# load the race and the data we need
session = ff1.get_session(year, wknd, ses)
weekend = session.weekend
laps = session.load_laps(with_telemetry=True)
lap = laps.pick_driver(driver).pick_fastest()

# Get telemetry data
x = lap.telemetry['X']              # values for x-axis
y = lap.telemetry['Y']              # values for y-axis
color = lap.telemetry['Speed']      # value to base color gradient on


##############################################################################
# Now, we create a set of line segments so that we can color them
# individually. This creates the points as a N x 1 x 2 array so that we can
# stack points  together easily to get the segments. The segments array for
# line collection needs to be (numlines) x (points per line) x 2 (for x and y)
points = np.array([x, y]).T.reshape(-1, 1, 2)
segments = np.concatenate([points[:-1], points[1:]], axis=1)


##############################################################################
# After this, we can actually plot the data.

# We create a plot with title and adjust some setting to make it look good.
fig, ax = plt.subplots(sharex=True, sharey=True, figsize=(12, 6.75))
fig.suptitle(f'{weekend.name} {year} - {driver} - Speed', size=24, y=0.97)

# Adjust margins and turn of axis
plt.subplots_adjust(left=0.1, right=0.9, top=0.9, bottom=0.12)
ax.axis('off')


# After this, we plot the data itself.
# Create background track line
ax.plot(lap.telemetry['X'], lap.telemetry['Y'], color='black', linestyle='-', linewidth=16, zorder=0)

# Create a continuous norm to map from data points to colors
norm = plt.Normalize(color.min(), color.max())
lc = LineCollection(segments, cmap=colormap, norm=norm, linestyle='-', linewidth=5)

# Set the values used for colormapping
lc.set_array(color)

# Merge all line segments together
line = ax.add_collection(lc)


# Finally, we create a color bar as a legend.
cbaxes = fig.add_axes([0.25, 0.05, 0.5, 0.05])
normlegend = mpl.colors.Normalize(vmin=color.min(), vmax=color.max())
legend = mpl.colorbar.ColorbarBase(cbaxes, norm=normlegend, cmap=colormap, orientation="horizontal")



# Show the plot
plt.savefig(str(s_input))
print(s_input + "good")
sys.stdout.flush()
