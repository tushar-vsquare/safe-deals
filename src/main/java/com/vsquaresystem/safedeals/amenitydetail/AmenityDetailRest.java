package com.vsquaresystem.safedeals.amenitydetail;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.vsquaresystem.safedeals.user.User;
import com.vsquaresystem.safedeals.user.UserDAL;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/amenitydetail")
public class AmenityDetailRest {

    private Logger logger = LoggerFactory.getLogger(this.getClass());

    @Autowired
    private AmenityDetailService amenitydetailservice;

    @Autowired
    private UserDAL userDAL;

    @Autowired
    private AmenityDetailDAL amenityDetailDal;

    @RequestMapping(method = RequestMethod.GET)
    public List<AmenityDetail> findAll(
            @RequestParam(value = "offset", required = false, defaultValue = "0") Integer offset) {
        return amenityDetailDal.findAll(offset);

    }

    @RequestMapping(value = "/complete_amenity_details", method = RequestMethod.GET)
    public List<AmenityDetail> findAmenityDetails() {
        return amenityDetailDal.findAmenityDetails();
    }

    @RequestMapping(value = "/count", method = RequestMethod.GET)
    public Integer count() throws SQLException {
        return amenityDetailDal.count();
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    public AmenityDetail findById(@PathVariable("id") Integer id) {
        return amenityDetailDal.findById(id);
    }

    @RequestMapping(method = RequestMethod.POST)
    public AmenityDetail insert(@RequestBody AmenityDetail amenitydetail,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User currentUser) throws JsonProcessingException {
        User user = userDAL.findByUsername(currentUser.getUsername());
        amenitydetail.setUserId(user.getId());
        return amenityDetailDal.insert(amenitydetail);
    }

    @RequestMapping(value = "/find/name", method = RequestMethod.GET)
    public List<AmenityDetail> findByName(@RequestParam("name") String name) {
        return amenityDetailDal.findByName(name);
    }

    @RequestMapping(value = "/find/name_like", method = RequestMethod.GET)
    public List<AmenityDetail> findByNameLike(@RequestParam("name") String name) {
        return amenityDetailDal.findByNameLike(name);
    }

    @RequestMapping(value = "/find/amenity_detail_name", method = RequestMethod.GET)
    public AmenityDetail findByAmenityDetailName(@RequestParam("name") String name) {
        return amenityDetailDal.findByAmenityDetailName(name);
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable("id") Integer id,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User currentUser) throws JsonProcessingException {
        User user = userDAL.findByUsername(currentUser.getUsername());
        amenityDetailDal.delete(id, user.getId());
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.POST)
    public AmenityDetail update(@RequestBody AmenityDetail amenitydetail,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User currentUser) throws JsonProcessingException {
        User user = userDAL.findByUsername(currentUser.getUsername());
        amenitydetail.setUserId(user.getId());
        logger.info("amenitydetail", amenitydetail);
        return amenityDetailDal.update(amenitydetail);
    }

    @RequestMapping(value = "/ad_filter", method = RequestMethod.GET)
    public List<AmenityDetail> findByADFilter(
            @ModelAttribute AmenityDetailFilter amenityDetailFilter) {
        return amenityDetailDal.findByADFilter(amenityDetailFilter);
    }

    @RequestMapping(value = "/find/amenity_id/city_id", method = RequestMethod.GET)
    public List<AmenityDetail> findByAmenityIdCityId(@RequestParam("amenityId") Integer amenityId, @RequestParam("cityId") Integer cityId) {
        return amenityDetailDal.findByAmenityIdCityId(amenityId, cityId);
    }

    @RequestMapping(value = "/export", method = RequestMethod.POST)
    public Boolean exportExcelData() throws IOException {
        logger.info("exportExcelData EXCEL DATA {}");
        return amenitydetailservice.exportExcel();
    }

    @RequestMapping(value = "/attachment", method = RequestMethod.POST)
    public Boolean uploadAttachment(@RequestParam MultipartFile attachment) throws IOException {
        logger.info("attachment in rest line56 {}", attachment);
        return amenitydetailservice.insertAttachments(attachment);
    }

    @RequestMapping(value = "/save_excel")
    public Boolean saveExcelData() throws IOException {
        logger.info("SAVE EXCEL DATA {line78}");
        System.out.println("REST SAVE EXCEL");
        amenitydetailservice.saveExcelToDatabase();
        return true;

    }
}
