<template>
  <div>
    <div class="formToAdd">
      <b-form v-if="show">
        <div class="form-row">
          <div class="form-group col-md-4 mb-4">
            <label for="validationCustom01">Upload Song</label>
            <div>
              <!-- Styled -->
              <b-form-file
                accept=".mp3"
                v-model="songfile"
                :state="Boolean(songfile)"
                placeholder="Choose a file..."
                drop-placeholder="Drop file here..."
                required
              />
             <!-- <button class="btn btn-primary" @click="uploadSong(songfile)">Upload</button> -->
              <div class="mt-3">Selected file: {{ songfile ? songfile.name : '' }}</div>

              <!-- Plain mode -->
            </div>
          </div>
          <div class="form-group col-md-4 mb-4">
            <label for="validationCustom01">Upload Image</label>

            <div>
              <!-- Styled -->
              <b-form-file
                v-model="imagefile"
                accept=".jpg, .png, .gif"
                :state="Boolean(imagefile)"
                placeholder="Choose a file..."
                drop-placeholder="Drop file here..."
                required
              />

              <div class="mt-3">Selected file: {{ imagefile ? imagefile.name : '' }}</div>

            </div>
          </div>
          <div class="form-group col-md-4 mb-4">
            <label for="validationCustom01">Enter Genre</label>

            <b-form-select v-model="selected" :options="options"/>
            <div class="mt-3">Selected:
              <strong>{{ selected }}</strong>
            </div>
          </div>
          <div class="form-group col-md-4 mb-4">
            <label for="validationCustom01">Song Name</label>
            <b-input
              class="mb-2 mr-sm-2 mb-sm-0"
              type="text"
              v-model="name"
              name="name"
              id="name"
              required
            />
          </div>
          <div class="form-group col-md-4 mb-4">
            <label for="validationCustom01">Artist Name</label>
            <b-input
              class="mb-2 mr-sm-2 mb-sm-0"
              type="text"
              v-model="artist"
              name="artist"
              id="artist"
              required
            />
          </div>
          <div class="form-group col-md-4 mb-4">
            <label for="validationCustom01">Album Name</label>
            <b-input
              class="mb-2 mr-sm-2 mb-sm-0"
              type="text"
              v-model="album"
              name="album"
              id="album"
              required
            />
          </div>
          <div class="form-group col-xs-6 mb-6">
            <label for="validationCustom01">Release date</label>
            <b-input
              class="mb-2 mr-sm-2 mb-sm-0"
              type="date"
              v-model="release_date"
              name="release_date"
              id="release_date"
            />
          </div>
          
        </div>
      </b-form>
      <div class="col-xs-6 mb-6 text-right">
            <label for="validationCustom01" class="empty-label">&nbsp;</label>
            <button class="addRowBtn btn btn-success" @click="uploadRow()">Upload</button>
          </div>
      <!-- <p v-if="showMessage === true">Data SuccessFully Saved</p> -->
    </div>
  </div>
</template>

<script>
  import DataPostApi from "../services/api/services";
export default {
   name: "AddStatus",
  data() {
    return {
      songfile: null,
      songfileuploaded: null,
      imagefile: null,
      imagefileuploaded: null,
      selected: null,
      name: "",
      artist: "",
      album: "",
      release_date: "",
      options: [
        { value: null, text: "Select" },
        { value: "Pop", text: "Pop" },
        { value: "Jazz", text: "Jazz" },
        { value: "Punk", text: "Punk" },
        { value: "Metal", text: "Metal" }
      ],
      show: true
    };
  },
  watch: {
    songfile: function(){
      console.log("song" + JSON.stringify(this.songfile))
    },
    imagefile: function(){
      console.log("Image" + JSON.stringify(this.imagefile))
    }
  },
  methods: {
    /** upload song */
    uploadSong:function(){
      let formData = new FormData();
      formData.append('file',this.songfile)
      let uploadedSong = DataPostApi.uploadSongtoS3(formData)
       return uploadedSong;
    },
    /** upload song */
    uploadImage: function() {
      let formData = new FormData();
      formData.append('file',this.imagefile)
      let uploadedImage = DataPostApi.uploadImagetoS3(formData)
      return uploadedImage;
    },
    uploadRow:function() {
      let me = this; 
      this.uploadSong()
      .then(responseSong => {
        console.log("Song link from AWS" + JSON.stringify(responseSong));
        if(responseSong.status == 200) {
          me.uploadImage()
            .then(responseImage => {
              console.log("Image link from AWS" + JSON.stringify(responseImage));
              if(responseImage.status == 200) {
                this.sendSongImage(responseSong,responseImage);
              }
            }).catch(err => {
              console.log("Error from Aws" + err)
            })
        }
      }).catch(err => {
        console.log("Error from Aws" + err)
      });
    },
    sendSongImage: function(responseSong,responseImage){
      let media_file = responseSong.data.location;
      let media_name = this.name;
      let media_file_thumbnail = responseImage.data.location;
      let media_genre = this.selected;
      let media_artist_name = this.artist;
      let media_album_name = this.album;
      let media_release_date = this.release_date;
      DataPostApi.uploadFiletoDatabase(
        media_file,
        media_name,
        media_file_thumbnail,
        media_genre,
        media_artist_name,
        media_album_name,
        media_release_date
        ).then((response) => {
          console.log("Response from Database" + response)
        }).catch(err => {
          console.log("Error from Database" +err);
        })
    }
  }
};
</script>

<style scoped>
[v-cloak] {
  display: none;
}
.edit {
  display: none;
}
.editing .edit {
  display: block;
}
.editing .view {
  display: none;
}
.empty-label {
  width: 100%;
}
.btn-success {
    color: #fff;
    background-color: #C7003C;
    border-color: #C7003C;
}
.formToAdd{
  padding-top: 30px;
}
</style>

