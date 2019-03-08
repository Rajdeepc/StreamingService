<template>
  <div>
    <div class="formToAdd">
      <h4>Upload Files Here:</h4>
      <b-form v-if="show">
        <div class="form-row">
          <div class="form-group col-md-3 mb-3">
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
             <button class="btn btn-primary" @click="uploadSong(songfile)">Upload</button>
              <div class="mt-3">Selected file: {{ songfile ? songfile.name : '' }}</div>

              <!-- Plain mode -->
            </div>
          </div>
          <div class="form-group col-xs-2 mb-2">
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
          <div class="form-group col-xs-2 mb-2">
            <label for="validationCustom01">Enter Genre</label>

            <b-form-select v-model="selected" :options="options"/>
            <div class="mt-3">Selected:
              <strong>{{ selected }}</strong>
            </div>
          </div>
          <div class="form-group col-xs-2 mb-2">
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
          <div class="form-group col-xs-2 mb-2">
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
          <div class="form-group col-xs-2 mb-2">
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
          <div class="form-group col-xs-2 mb-2">
            <label for="validationCustom01">Release date</label>
            <b-input
              class="mb-2 mr-sm-2 mb-sm-0"
              type="date"
              v-model="release_date"
              name="release_date"
              id="release_date"
            />
          </div>
          <div class="col-xs-3 mb-3">
            <label for="validationCustom01" class="empty-label">&nbsp;</label>
            <button class="addRowBtn btn btn-success" @click="uploadSongData()">Upload</button>
          </div>
        </div>
      </b-form>
      <p v-if="showMessage === true">Data SuccessFully Saved</p>
    </div>
  </div>
</template>

<script>
  import DataPostApi from "../services/api/loginValidation";
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
    uploadSong:function(songfile){
      let formData = new FormData();
      formData.append('file',songfile)
      DataPostApi.uploadSongtoS3(formData)
      .then(response => {
        console.log("Response from aws" + JSON.stringify(response));
      }).catch(err => {
        console.log("Error from Aws" + err)
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
</style>

